// ==UserScript==
// @name         Diep.io Packet WASM Hook
// @author       ABC
// @version      1.0.0
// @namespace    5327085435ba93c4eb8fb515dfb381101ccba3b7
// @description  5327085435ba93c4eb8fb515dfb381101ccba3b7
// @match        *://diep.io/
// @run-at       document-start
// @require      https://raw.githubusercontent.com/Qwokka/wail.min.js/5e32d36bd7a5e0830d1ff4b64d3587aea13f77da/wail.min.js
// @grant        none
// ==/UserScript== 

"use strict";

/*
  Usage is explained in the console on run
  For build 5327085435ba93c4eb8fb515dfb381101ccba3b7
  The way this script works will be explained in /memory or /wasm someday, but ignore that for now
*/

const nsfsk = false;

class PacketHook extends EventTarget {
 static get CONST() {
    return {
      BUILD: "5327085435ba93c4eb8fb515dfb381101ccba3b7",
      SEND_PACKET_INDEX: 105,
      RECV_PACKET_INDEX: 433,
      MALLOC: 'R',
      FREE: 'u',
      SOCKET_PTR: 104372,
    }
  }
  
  constructor(hook) {
    super();
    this.HEAPU8 = new Uint8Array(0);
    this.HEAP32 = new Int32Array(0);
    this.wasm = null;
    this._inject(hook);
    this._hijack();
  }
  _modify(bin, imports) {    
    console.log('Modifying WASM');
    const wail = new WailParser(new Uint8Array(bin));

    const sendPacket = wail.getFunctionIndex(PacketHook.CONST.SEND_PACKET_INDEX);
    const recvPacket = wail.getFunctionIndex(PacketHook.CONST.RECV_PACKET_INDEX);

    const mainHook = wail.addImportEntry({
      moduleStr: "hook",
      fieldStr: "mainHook",
      kind: "func",
      type: wail.addTypeEntry({
        form: "func",
        params: ["i32", "i32", "i32"],
        returnType: "i32"
      })
    });
    wail.addExportEntry(sendPacket, {
        fieldStr: "sendPacket",
        kind: "func",
    });
    wail.addExportEntry(recvPacket, {
        fieldStr: "recvPacket",
        kind: "func",
    });


    wail.addCodeElementParser(null, function ({ index, bytes }) {

      if (index === sendPacket.i32()) {
        const writer = new BufferReader(new Uint8Array(1)); // idk why a buf param is needed here

        writer.writeAtAnchor([
          OP_I32_CONST, 1,
          OP_GET_LOCAL, 1,
          OP_GET_LOCAL, 2,
          OP_CALL, ...VarUint32ToArray(mainHook.i32()),
          OP_IF, VALUE_TYPE_BLOCK,
              OP_RETURN,
          OP_END,
          ...bytes]);

        return writer.write()
      } else if (index === recvPacket.i32()) {
        const writer = new BufferReader(new Uint8Array(1));

        writer.writeAtAnchor([
          OP_I32_CONST, 0,
          OP_GET_LOCAL, 0,
          OP_GET_LOCAL, 1,
          OP_CALL, ...VarUint32ToArray(mainHook.i32()),
          OP_IF, VALUE_TYPE_BLOCK,
              OP_RETURN,
          OP_END,
          ...bytes]);

        return writer.write();
      }

      return false;
    });


    wail.parse()


    return wail.write()
  }
  
  _inject(mainHook) {
    const _initWasm = window.WebAssembly.instantiate;
    window.WebAssembly.instantiate = (bin, imports) => {
      bin = this._modify(bin, imports);

      imports.hook = { mainHook };
      this.HEAPU8 = new Uint8Array(imports.a.memory.buffer);
      this.HEAP32 = new Int32Array(imports.a.memory.buffer);
      
      return _initWasm(bin, imports).then((wasm) => {
        this.wasm = wasm.instance;
        this.malloc = this.wasm.exports[PacketHook.CONST.MALLOC];
        this.free = this.wasm.exports[PacketHook.CONST.FREE];
        console.log('Module exports done!\n\t- Hook.free\n\t- Hook.malloc\n\t- Hook.send\n\t- Hook.recv\n\t- Hook.addEventListener(\'clientbound\', ({data}) => console.log(data));\n\t- Hook.addEventListener(\'serverbound\', ({data}) => console.log(data));');
        return wasm
      }).catch(err => {
        console.error('Err in loading up wasm:')
        throw err;
      })
    };
  }
  
  _hijack() {
    let that = this;
    window.Object.defineProperty(Object.prototype, "postRun", {
      get() { },
      set(postRun) {
        delete Object.prototype.postRun
        this.postRun = postRun;

        that.Module = this;
        console.log('Module exports done! Hook.Module');
      },
      configurable: true,
    });
  }
  
  send(buf) {
    const {malloc, free, HEAP32, HEAPU8} = this;
    
    buf = new Uint8Array(buf);
    const ptr = malloc(buf.byteLength);
    
    HEAPU8.set(buf, ptr);
    
    this.wasm.exports.sendPacket(HEAP32[PacketHook.CONST.SOCKET_PTR >> 2], ptr, buf.byteLength);
    free(ptr);
  }
  
  recv(buf) {
    const {malloc, free, HEAP32, HEAPU8} = this;
    
    buf = new Uint8Array(buf);
    const ptr = malloc(buf.byteLength);
    
    HEAPU8.set(buf, ptr);
    
    this.wasm.exports.recvPacket(ptr, buf.byteLength);
    free(ptr);
  }
}

if (!nsfsk) throw "Packet Hook";

const TYPE = ['incoming', 'outgoing'];

window.Hook = new PacketHook(function(type, ptr, len) {
  Hook.dispatchEvent(new MessageEvent(TYPE[type], {data: Hook.HEAPU8.slice(ptr, ptr+len)}))
  
  return 0;
});
