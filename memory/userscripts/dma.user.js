// ==UserScript==
// @name         Diep Memory Analyzer
// @version      1.0.0
// @description  Script dedicated to reverse engineering memory structs and analyzing the memory
// @namespace    github.com/ABCxFF
// @author       ABC
// 
// @match        *://diep.io/
// @run-at       document-start
// @grant        none
// 
// @require      https://gist.githubusercontent.com/ABCxFF/b089643396fbb933996966b5ab632821/raw/6f93ee2bac45e308067fafff21e1110132f9ca0e/wail.js
// ==/UserScript==

// Bring back to instantiate
WebAssembly.instantiateStreaming = (r, i) => r.arrayBuffer().then(b => WebAssembly.instantiate(b, i));

const CONFIG = {
  GLOBAL_KEY: "DMA", // window[GLOBAL_KEY], localStorage[GLOBAL_KEY + "Store"]
  WATCH_MEM: false,
  MEM_HISTORY_SIZE: 1,
  EXPORT_KEY: location.origin === 'https://diep.io' ? 'a' : 'env'
}

!((exports) => { 
  // EventEmitter
  !((listeners) => {
    exports.__l = listeners;
    exports.on = (event, cb, prepend=false) => {

      if (!listeners[event]) listeners[event] = [];
      
      if (prepend) listeners[event].unshift(cb);
      else listeners[event].push(cb);
      
      return listeners[event].length - 1; // index
    }

    exports.off = (event, index) => {
      if (!listeners[event] || index < 0) return;

      listeners[event].splice(index, 1);
    }

    exports.emit = (event, ...data) => { // made to be somewhat efficient
      if (!listeners[event] || !listeners[event].length) return;
      let len = listeners[event].length;
      
      for (let i = 0; i !== len; ++i) listeners[event][i](...data);
    }
  })({});
  // LocalStore
  const storage = (() => {
    const key = CONFIG.GLOBAL_KEY + "Store";
    
    const storage = exports.storage = {};
    
    storage.store = (data=storage._cache) => localStorage.setItem(key, JSON.stringify(storage._cache = data));
    storage.fetch = () => storage._cache = JSON.parse(localStorage.getItem(key) || "{}");
    storage.wipe = () => storage.store({});
    
    storage._cache = storage.fetch();
    
    return storage;
  })();

  // Hook into Module
  Object.defineProperty(Object.prototype, "dynCall_v", {
    get() { },
    set(dynCall_v) {
      delete Object.prototype.dynCall_v
      this.dynCall_v = dynCall_v;
      exports.Module = this;
      exports.malloc = this._malloc;
      exports.free = this._free;
      
      // Wipe old settings, display them to the user if they care
      exports.emit("load");
    },
    configurable: true,
  });
  
  // Hook into WebAssembly instantiation
  !(_inst => WebAssembly.instantiate = (wasm, imports) => {
    if (imports && imports[CONFIG.EXPORT_KEY]) {
      const loader = {raw: new Uint8Array(new Uint8Array(wasm)), buffer: new Uint8Array(wasm), imports};
      const hexChars = [48,49,50,51,52,53,54,55,56,57,97,98,99,100,101,102];
      let build = "unknown";
      let K = 0;
      scan: for (let i = 0; i < loader.raw.length; ++i) {
          if (hexChars.includes(loader.raw[i])) {
              let s = i;
              for (let j = 0; j < 40; ++j, ++i) {
                  if (!hexChars.includes(loader.raw[i])) continue scan;
              }
              if (hexChars.includes(loader.raw[i++])) {
                  while (hexChars.includes(loader.raw[i++])) {};
                  continue scan;
              }

              if (K++ === 0) continue scan;
              build = new TextDecoder().decode(loader.raw.subarray(s, i - 1));
              break scan;
          }
      }
      exports.BUILD = build;

      if (exports.BUILD !== storage.fetch().build) {
        prompt(CONFIG.GLOBAL_KEY + ": New build, wiping settings\n\nbuild_" + exports.BUILD, JSON.stringify(storage.fetch()));

        storage.wipe();
        storage.fetch().build = exports.BUILD;
        storage.store();
      }

      exports.emit("precompile", loader);
      exports.wasm = {}
      exports.wasm.loader = loader;
      WebAssembly.instantiate = _inst;
      
      return _inst(loader.buffer, loader.imports).then((results) => {
        const memory = Object.values(results.instance.exports).find(e => e instanceof WebAssembly.Memory);

        exports.HEAPU8  = new Uint8Array(memory.buffer);
        exports.HEAP8   = new Int8Array(memory.buffer);
        exports.HEAPU16 = new Uint16Array(memory.buffer);
        exports.HEAP16  = new Int16Array(memory.buffer);
        exports.HEAPU32 = new Uint32Array(memory.buffer);
        exports.HEAP32  = new Int32Array(memory.buffer);
        exports.HEAPF32 = new Float32Array(memory.buffer);
        exports.HEAPF64 = new Float64Array(memory.buffer);
        exports.HEAPU64  = new BigUint64Array(memory.buffer);
        exports.HEAP64  = new BigInt64Array(memory.buffer);
        exports.malloc = (exports.Module||{})._malloc;
        exports.free = (exports.Module||{})._free;
        
        exports.emit("compile", results.instance.exports, results);

        return results;
      });
    }
    
    return _inst(wasm, imports);
  })(WebAssembly.instantiate.bind(WebAssembly.instantiate));

  // These allow you to export functions
  exports.addExportEntry = (name, index) => {
    const exportEntries = storage.fetch().exports || [];
    
    exportEntries.push({name, index});
    storage.fetch().exports = exportEntries;
    storage.store();
    
    return exportEntries.length - 1;
  }
  
  exports.removeExportEntry = (name, index) => {
    if (typeof index === "undefined" && typeof name === "number" && name >= 0) {
      const exportEntries = storage.fetch().exports || [];
      
      exportEntries.splice(name, 1);
      
      storage.store();
      return true;
    } else if (typeof index === "undefined") return false;
    
    const exportEntries = storage.fetch().exports || [];
    
    return exports.removeExportEntry(exportEntries.findIndex(e => e.name === name && e.index === index))
  }
  
  // These allow you to log / dispatch events on the calling of functions
  exports.addLogPoint = (logName, index) => {
    const loggers = storage.fetch().loggers || [];
    
    loggers.push({name: logName, index});
    storage.fetch().loggers = loggers;
    storage.store();
    
    return loggers.length - 1;
  }
  
  exports.removeLogPoint = (logName, index) => {
    if (typeof index === "undefined" && typeof logName === "number" && logName >= 0) {
      const loggers = storage.fetch().loggers || [];
      
      loggers.splice(logName, 1);
      
      storage.store();
      
      return true;
    } else if (typeof index === "undefined") return false;
    
    const loggers = storage.fetch().loggers || [];
    
    return exports.removeLogPoint(loggers.findIndex(e => e.name === logName && e.index === index));
  }
  
  // makes the exports accessible
  exports.on("compile", (wasmExports, results) => {
    exports.wasm.results = results;
    for (const name in wasmExports) if (name.slice(0, 5) === "diep.") exports.wasm[name.slice(5)] = wasmExports[name];
  });
  
  // add exports, log points, and getter watchers
  exports.on("precompile", (loader) => {
    const decompilerWail = new WailParser(loader.buffer);
    decompilerWail.parse();
    
    const parsed = window.parsedSections = decompilerWail._parsedSections;

    const getBySection = (code) => parsed.find(s => s.id === code);
    const importSection = getBySection(SECTION_IMPORT);
    const typeSection = getBySection(SECTION_TYPE);
    const funcSection = getBySection(SECTION_FUNCTION);
    const codeSection = getBySection(SECTION_CODE);
    
    const wail = new WailParser(loader.buffer);
    
    const data = storage.fetch();
    
    const exportEntries = data.exports || [];
    const loggers = (data.loggers || []).map(({index, name}) => ({name, _index: index, index: wail.getFunctionIndex(index)}));
    
    let names = [];
    for (let i = 0; i < exportEntries.length; ++i) {
      
      const {name, index} = exportEntries[i];
      
      if (names.includes(name)) {
        console.warn(`[${CONFIG.GLOBAL_KEY}] Duplicate export name ${name}:${index}, removing.`);
        
        exports.removeExportEntry(i);
        
        continue;
      }
      wail.addExportEntry(wail.getFunctionIndex(index), {
          fieldStr: "diep." + name,
          kind: "func",
      });
      
      names.push(name);
    }
    
    const importFuncCount = importSection.results.findIndex(imp => imp.kind !== "func");
    
    const loggerImports = loader.imports[CONFIG.GLOBAL_KEY.toLowerCase() + ".logger"] = {};
    
    for (const {index, _index, name} of loggers) {
      const params = typeSection.results[funcSection.results[_index - importFuncCount].funcType].params;
      
      loggerImports[name] = (...params) => {
        exports.emit(name, params, _index)
      }
      
      const loggerIndex = wail.addImportEntry({
        moduleStr: CONFIG.GLOBAL_KEY.toLowerCase() + ".logger",
        fieldStr: name,
        kind: "func",
        type: wail.addTypeEntry({
          form: "func",
          params,
        })
      });
      
      wail.addCodeElementParser(index, ({bytes}) => {
        const callerBytes = [];
        
        for (let i = 0; i < params.length; ++i) callerBytes.push(OP_GET_LOCAL, ...VarUint32ToArray(i));
        
        callerBytes.push(OP_CALL, ...VarUint32ToArray(loggerIndex.i32()));
        
        const buffer = new Uint8Array(callerBytes.length + bytes.length);
        buffer.set(callerBytes, 0);
        buffer.set(bytes, callerBytes.length);
        
        return buffer;
      });
    }
    
    loader.imports[CONFIG.EXPORT_KEY][CONFIG.GLOBAL_KEY.toLowerCase() + ".patch"] = () => {};
    
    wail.addImportEntry({
      moduleStr: CONFIG.EXPORT_KEY,
      fieldStr: CONFIG.GLOBAL_KEY.toLowerCase() + ".patch",
      kind: "func",
        type: wail.addTypeEntry({
        form: "func",
        params: [],
      })
    });
    
    if (!CONFIG.WATCH_MEM) {
      wail.parse();

      loader.buffer = wail.write();
      return;
    }
    /* 
      Bits     Desc
       DESCRIPTOR FLAGS
       01000000  isWrite. When set, the address is being written to
       00100000  isFloat. When set, it is a float
       00010000  isSign.  When set, the value is signed
       SIZE FLAGS
       00001000  64bit
       00000100  32bit
       00000010  16bit
       00000001  8bit
    */
    
    const readHandler = wail.addImportEntry({
      moduleStr: CONFIG.GLOBAL_KEY.toLowerCase() + ".watch",
      fieldStr: "read",
      kind: "func",
      type: wail.addTypeEntry({
        form: "func",
        // addr, offset,, flags
        params: ["i32", "i32", "i32"],
        returnType: "i32"
      })
    });
    const writeHandler = wail.addImportEntry({
      moduleStr: CONFIG.GLOBAL_KEY.toLowerCase() + ".watch",
      fieldStr: "write",
      kind: "func",
      type: wail.addTypeEntry({
        form: "func",
        // addr, value, offset, flags
        params: ["i32", "i64", "i32", "i32"],
        returnType: "i32"
      })
    });
    const frozenAddresses = [];
    const debugAddresses = [];
    const BUILDER = {
      0b00100000: "F",
      0b00010000: "",
      0b1000: "64",
      0b0100: "32",
      0b0010: "16",
      0b0001: "8",
    }
    const SHIFTS = {
      0b1000: 3,
      0b0100: 2,
      0b0010: 1,
      0b0001: 0,
    }
    exports.freezeAddress = (addr) => {
      frozenAddresses.push(addr)
    }
    exports.unfreezeAddress = (addr) => {
      frozenAddresses.splice(frozenAddresses.indexOf(addr), 1);
    }
    
    exports.debugAddress = (addr, type="*") => {
      if (!["*", "w", "r"].includes(type)) throw new TypeError("Invalid type. Must be one of '*' 'w' 'r'")
      debugAddresses.push({addr,type})
    }
    exports.undebugAddress = (addr) => {
      debugAddresses.splice(debugAddresses.findIndex(o => o.addr === addr), 1);
    }
    const readObj = {}; // less allocation
    const writeObj = {}; // less allocation
    loader.imports[CONFIG.GLOBAL_KEY.toLowerCase() + ".watch"] = {
      read(addr, offset, flags) {
        if (debugAddresses.findIndex(o => o.addr === addr + offset && (o.type === "*" || o.type === "r")) !== -1) debugger;
        if (!exports.watch.ACTIVATED) return addr;
        
        readObj.addr = addr;
        readObj.offset = offset;
        readObj.flags = flags;
        exports.emit("watch:read", readObj);
        
        return addr;
      },
      write(addr, value, offset, flags) {
        if (debugAddresses.findIndex(o => o.addr === addr + offset && (o.type === "*" || o.type === "w")) !== -1) debugger;
        
        if (!frozenAddresses.includes(addr + offset)) {
          exports.HEAPU64[1016 >> 3] = value;
        } else {
          const heap = exports["HEAP" + (BUILDER[flags & 0b00110000] ?? "U") + BUILDER[flags & 0b1111]];
          heap[1016 >> SHIFTS[flags & 0b1111]] = heap[(addr + offset) >> SHIFTS[flags & 0b1111]];
        }
        if (!exports.watch.ACTIVATED) return addr;
        
        writeObj.addr = addr;
        writeObj.offset = offset;
        writeObj.value = value;
        writeObj.flags = flags;

        exports.emit("watch:write", writeObj);
        
        return addr;
      }
    };
    
    const readWatchInstrModifier = function(instrBytes) {
      const reader = new BufferReader(instrBytes);

      const opcode = reader.readUint8();

      const align = reader.readVarUint32();
      const offset = reader.readVarUint32();

      let flags = 0;

      switch (opcode) {
        case OP_I32_LOAD8_S:
        case OP_I64_LOAD8_S:
          flags |= 0b00010000; // signed
        case OP_I32_LOAD8_U:
        case OP_I64_LOAD8_U:
          flags |= 0b00000001; // 8bit
          break;
        case OP_I32_LOAD16_S:
        case OP_I64_LOAD16_S:
          flags |= 0b00010000; // signed
        case OP_I64_LOAD16_U:
        case OP_I32_LOAD16_U:
          flags |= 0b00000010; // 16bit
          break;
        case OP_I32_LOAD:
          flags |= 0b00010100; // signed, 32bit
          break;
        case OP_F32_LOAD:
          flags |= 0b00100100; // float, 32bit
          break;
        case OP_I64_LOAD32_S:
          flags |= 0b00010000; // signed
        case OP_I64_LOAD32_U:
          flags |= 0b00000100; // signed, 32bit
          break;
        case OP_I64_LOAD:
          flags |= 0b00011000; // signed, 64bit
          break;
        case OP_F64_LOAD:
          flags |= 0b00101000; // float, 64bit
          break;      
      }
      
      reader.copyBuffer([
        OP_I32_CONST, ...VarSint32ToArray(offset),// OP_I32_ADD,// ...(offset === 0 ? [] : [OP_I32_CONST, ...VarUint32ToArray(offset), OP_I32_ADD]),
        OP_I32_CONST, ...VarSint32ToArray(flags),
        OP_CALL, ...VarUint32ToArray(readHandler.i32()),
        
        opcode, align, ...VarUint32ToArray(offset)
      ]);
      
      return reader.write();
    }
    
    const LOAD_OP_TABLE = {
      [OP_I32_STORE8]: OP_I32_LOAD8_U,
      [OP_I64_STORE8]: OP_I64_LOAD8_U,
      [OP_I32_STORE16]: OP_I32_LOAD16_U,
      [OP_I64_STORE16]: OP_I64_LOAD16_U,
      [OP_F32_STORE]: OP_F32_LOAD,
      [OP_I32_STORE]: OP_I32_LOAD,
      [OP_I64_STORE32]: OP_I64_LOAD32_U,
      [OP_F64_STORE]: OP_F64_LOAD,
      [OP_I64_STORE]: OP_I64_LOAD
    }
    
    const writeWatchInstrModifier = function(instrBytes) {
      const reader = new BufferReader(instrBytes);

      const opcode = reader.readUint8();

      const align = reader.readVarUint32();
      const offset = reader.readVarUint32();

      let flags = 0b01000000; // write

      switch (opcode) {
        case OP_I32_STORE8:
        case OP_I64_STORE8:
          flags |= 0b00000001; // 8bit
          break;
        case OP_I32_STORE16:
        case OP_I64_STORE16:
          flags |= 0b00000010; // 16bit
          break;
        case OP_F32_STORE:
          flags |= 0b00100100; // float, 32 bit
          break;
        case OP_I64_STORE32:
        case OP_I32_STORE:
          flags |= 0b00000100; // 32bit
          break;
        case OP_F64_STORE:
          flags |= 0b00101000; // float, 64bit  
          break;
        case OP_I64_STORE:
          flags |= 0b00001000; // 64bit
          break;
      }
      
      switch (opcode) {
        case OP_F32_STORE:
          reader.copyBuffer([OP_I32_REINTERPRET_F32]);
        case OP_I32_STORE8:
        case OP_I32_STORE16:
        case OP_I32_STORE:
          reader.copyBuffer([OP_I64_EXTEND_U_I32])
          break;
        case OP_F64_STORE:
          reader.copyBuffer([OP_I64_REINTERPRET_F64]);
        case OP_I64_STORE8:
        case OP_I64_STORE16:
        case OP_I64_STORE32:
        case OP_I64_STORE:
          break; 
      }
      
      
      reader.copyBuffer([
        OP_I32_CONST, ...VarSint32ToArray(offset),// OP_I32_ADD,// ...(offset === 0 ? [] : [OP_I32_CONST, ...VarUint32ToArray(offset), OP_I32_ADD]),
        OP_I32_CONST, ...VarSint32ToArray(flags),
        OP_CALL, ...VarUint32ToArray(writeHandler.i32()),
        
        OP_I32_CONST, ...VarSint32ToArray(1016),
        LOAD_OP_TABLE[opcode], ...VarUint32ToArray(align), 0,
        
        opcode, align, ...VarUint32ToArray(offset)
      ]);
      
      return reader.write();
    }
    
    wail.addInstructionParser(OP_I32_LOAD,     readWatchInstrModifier);
    wail.addInstructionParser(OP_I64_LOAD,     readWatchInstrModifier);
    wail.addInstructionParser(OP_F32_LOAD,     readWatchInstrModifier);
    wail.addInstructionParser(OP_F64_LOAD,     readWatchInstrModifier);
    wail.addInstructionParser(OP_I32_LOAD8_S,  readWatchInstrModifier);
    wail.addInstructionParser(OP_I32_LOAD8_U,  readWatchInstrModifier);
    wail.addInstructionParser(OP_I32_LOAD16_S, readWatchInstrModifier);
    wail.addInstructionParser(OP_I32_LOAD16_U, readWatchInstrModifier);
    wail.addInstructionParser(OP_I64_LOAD8_S,  readWatchInstrModifier);
    wail.addInstructionParser(OP_I64_LOAD8_U,  readWatchInstrModifier);
    wail.addInstructionParser(OP_I64_LOAD16_S, readWatchInstrModifier);
    wail.addInstructionParser(OP_I64_LOAD16_U, readWatchInstrModifier);
    wail.addInstructionParser(OP_I64_LOAD32_S, readWatchInstrModifier);
    wail.addInstructionParser(OP_I64_LOAD32_U, readWatchInstrModifier);

    wail.addInstructionParser(OP_I32_STORE,   writeWatchInstrModifier);
    wail.addInstructionParser(OP_I64_STORE,   writeWatchInstrModifier);
    wail.addInstructionParser(OP_F32_STORE,   writeWatchInstrModifier);
    wail.addInstructionParser(OP_F64_STORE,   writeWatchInstrModifier);
    wail.addInstructionParser(OP_I32_STORE8,  writeWatchInstrModifier);
    wail.addInstructionParser(OP_I32_STORE16, writeWatchInstrModifier);
    wail.addInstructionParser(OP_I64_STORE8,  writeWatchInstrModifier);
    wail.addInstructionParser(OP_I64_STORE16, writeWatchInstrModifier);
    wail.addInstructionParser(OP_I64_STORE32, writeWatchInstrModifier);
    
    wail.parse();

    loader.buffer = wail.write();
  });
  
  // add in heap
//   exports.on("precompile", () => {
//     const {
//       HEAPU8,  HEAP8,  HEAPU16, HEAP16, 
//       HEAPU32, HEAP32,
//       HEAPF32, HEAPF64,
//       _malloc: malloc, _free: free
//     } = exports.Module;
//     console.log(HEAPU8)
//     // Add in HEAPU64 and HEAP64 (bigints)
//     const HEAPU64 = exports.Module.HEAPU64 = new BigUint64Array(HEAPU8.buffer);
//     const HEAP64 = exports.Module.HEAP64 = new BigInt64Array(HEAPU8.buffer);
    
//     // Might as well make it accessable too
//     exports.HEAPU8 = HEAPU8;
//     exports.HEAP8 = HEAP8;
//     exports.HEAPU16 = HEAPU16;
//     exports.HEAP16 = HEAP16;
//     exports.HEAPU32 = HEAPU32;
//     exports.HEAP32 = HEAP32;
//     exports.HEAPF32 = HEAPF32;
//     exports.HEAPF64 = HEAPF64;
//     exports.HEAP64 = HEAP64;
//     exports.HEAPU64 = HEAPU64;
//     exports.malloc = malloc;
//     exports.free = free;
//   });
  
  // CX's $, modified
  exports.$ = () => {throw "Exports not ready yet"};
  exports.on("compile", () => {
    const {
      HEAPU8,  HEAP8,  HEAPU16, HEAP16, 
      HEAPU32, HEAP32,
      HEAPF32, HEAPF64,
      HEAP64, HEAPU64,
      _malloc: malloc, _free: free
    } = exports;
    
    const Decoder = new TextDecoder();
    const Encoder = new TextEncoder();
    
    const getter = ({ ptr }, prop) => {
      switch (prop) {
        case 'at': return ptr
        case 'u8':  return HEAPU8[ptr]
        case 'i8': return HEAP8[ptr]
        case 'u16': return HEAPU16[ptr >> 1]
        case 'i16': return HEAP16[ptr >> 1]
        case 'u32': return HEAPU32[ptr >> 2]
        case 'i32': return HEAP32[ptr >> 2]
        case 'u64': return HEAPU64[ptr >> 3]
        case 'f32': return HEAPF32[ptr >> 2]
        case ':f32': return HEAPF32[(ptr) >> 2]
        case 'f64': return HEAPF64[ptr >> 3]
        case 'i64': return HEAP64[ptr >> 3];
        case 'u64': return HEAPU64[ptr >> 3];
        case 'utf8': return Decoder.decode(HEAPU8.subarray(ptr, HEAPU8.indexOf(0, ptr)));
        case 'cstr': {
          let strAt = ptr;
          let length = HEAPU8[ptr + 11]
          if (length === 0x80) {
            length = HEAP32[(ptr + 4) >> 2];
            strAt = HEAP32[ptr >> 2];
          }
          
          return Decoder.decode(HEAPU8.subarray(strAt, strAt + length))
        }
        case 'raw': {
          return (size=64) => HEAPU8.subarray(ptr, ptr + size);
        }
        case 'vector': {
          const vector = []
          for (let i = HEAPU32[ptr >> 2]; i < HEAPU32[(ptr >> 2) + 1]; i += 4)
            vector.push(exports.$(i))
          return vector;
        }
        case '$vector': {
          const $vector = []
          for (let i = HEAPU32[ptr >> 2]; i < HEAPU32[(ptr >> 2) + 1]; i += 4)
            $vector.push(exports.$(HEAPU32[i >> 2]))
          return $vector;
        }
        case '$': return exports.$(HEAPU32[ptr >> 2])
      }
      const offset = parseInt(prop, 10);

      if (!Number.isNaN(offset))
        return exports.$(ptr + offset)
    }

    const setter = ({ ptr }, prop, to) => {
      if (to === undefined || to === null) return;
      
      switch (prop) {
        case 'u8':
          HEAPU8[ptr] = to;
          break;
        case 'i8':
          HEAP8[ptr] = to;
          break;
        case 'u16':
          HEAPU16[ptr >> 1] = to;
          break;
        case 'i16':
          HEAP16[ptr >> 1] = to;
          break;
        case '$':
        case 'u32':
          HEAPU32[ptr >> 2] = to;
          break;
        case 'i32':
          HEAP32[ptr >> 2] = to;
          break;
        case 'u64':
          HEAPU64[ptr >> 3] = to;
          break;
        case 'f32':
          HEAPF32[ptr >> 2] = to;
          break;
        case 'f64':
          HEAPF64[ptr >> 3] = to;
          break;
        case 'i64':
          HEAP64[ptr >> 3] = to;
          break;
        case 'u64':
          HEAPU64[ptr >> 3] = to;
          break;
        case 'utf8': {
            const buf = Encoder.encode(to.toString());
            HEAPU8.set(buf, ptr);
            HEAPU8[ptr + buf.byteLength] = 0;
          }
          break;
      case 'cstr': {
            const textBuf = Encoder.encode(to.toString());
            const len = textBuf.length;

            if (HEAPU8[ptr + 11] === 0x80) free(HEAP32[ptr >> 2]);

            HEAPU8.set(new Uint8Array(12), ptr); // clear

            if (len < 11) {
              HEAPU8.set(textBuf, ptr);
              
              HEAPU8[ptr + 11] = len;
            } else {
              const strPtr = malloc(len + 1);

              HEAPU8.set(textBuf, strPtr);
              HEAPU8[strPtr + len] = 0;
              HEAP32.set([strPtr, len, -0x7FFFFFE0], ptr >> 2);
            }
          }
          break;
        default:
          console.warn("Invalid property " + prop);
          break;
      }
      
      return true;
    }

    exports.$ = ptr => new Proxy({ ptr }, { get: getter, set: setter })
  });
  
  // scanners
  exports.scan = (() => {
    const scan = (arr, needle, max=500) => {
      const results = [];
      if (needle.length <= 0 || arr.length < needle.length) return results;
      while (arr[0] === "*") arr.shift();
      while (arr[arr.length - 1] === "*") arr.pop();
      const needleLen = needle.length;
      const len = arr.length - needleLen;

      jumper: for (let i = arr.indexOf(needle[0]); i <= len && i !== -1 && results.length < max; i = arr.indexOf(needle[0], i + 1)) {
        for (let j = 1; j < needleLen; ++j) if (needle[j] !== arr[i + j] && needle[j] !== "*") continue jumper;

        results.push(i);
      };

      return results;
    };
    
    exports.on("compile", () => {
      const {
        HEAPU8,  HEAP8,  HEAPU16, HEAP16, 
        HEAPU32, HEAP32,
        HEAPF32, HEAPF64,
        HEAP64, HEAPU64,
      } = exports;

      const Encoder = new TextEncoder();

      const arrayify = (v) => [v].flat();
      
      exports.scan.i8 = (vals, max=500) => scan(HEAP16, arrayify(vals).map(v => (v << 24) >> 24), max).map(i => i << 1);
      exports.scan.u8 = (vals, max=500) => scan(HEAPU16, arrayify(vals).map(v => (v << 24) >>> 24), max).map(i => i << 1);
      
      exports.scan.i16 = (vals, max=500) => scan(HEAP16, arrayify(vals).map(v => (v << 16) >> 16), max).map(i => i << 1);
      exports.scan.u16 = (vals, max=500) => scan(HEAPU16, arrayify(vals).map(v => (v << 16) >>> 16), max).map(i => i << 1);
      
      exports.scan.i32 = (vals, max=500) => scan(HEAP32, arrayify(vals).map(v => v & 0), max).map(i => i << 2);
      exports.scan.u32 = (vals, max=500) => scan(HEAPU32, arrayify(vals).map(v => v >>> 0), max).map(i => i << 2);
      
      exports.scan.f32 = (vals, max=500) => scan(HEAPF32, arrayify(vals).map(Math.fround), max).map(i => i << 2);
      exports.scan.f64 = (vals, max=500) => scan(HEAPF64, arrayify(vals), max).map(i => i << 3);
      
      exports.scan.i64 = (vals, max=500) => scan(HEAPF64, arrayify(vals).map(v => v & 0x8000000000000000n ? ~(v & 0x7FFFFFFFFFFFFFFFn) : v & 0x7FFFFFFFFFFFFFFFn), max).map(i => i << 3);
      exports.scan.u64 = (vals, max=500) => scan(HEAPF64, arrayify(vals).map(v => v & 0x8000000000000000n ? ~(v & 0x7FFFFFFFFFFFFFFFn) : v & 0x7FFFFFFFFFFFFFFFn), max).map(i => i << 3);
      
      exports.scan.raw = (bytes, max=500) => scan(HEAPU8, bytes, max);
      exports.scan.utf8 = (string, max=500, full=true) => {
        const rawBuf = Encoder.encode(string);
        const ntBuf = new Uint8Array(rawBuf.byteLength + (full & 1));
        ntBuf.set(rawBuf);
        
        return scan(HEAPU8, ntBuf, max);
      }
    })
    
    return {_internal: scan};
  })();
  
  const getCallstack = (err=Error()) => err.stack.slice(err.stack.indexOf("\n") + 1);
  
  // read write watch interface
  !((watch) => {
    watch.ACTIVATED = false;
    
    const history = watch.history = Array(CONFIG.MEM_HISTORY_SIZE)
    const tracks = watch.tracks = {
      total: 0,
      reads: 0,
      writes: 0
    }
    
    const BUILDER = {
      0b00100000: "F",
      0b00010000: "",
      0b1000: "64",
      0b0100: "32",
      0b0010: "16",
      0b0001: "8",
    }
    const SHIFTS = {
      0b1000: 3,
      0b0100: 2,
      0b0010: 1,
      0b0001: 0,
    }
    const watcher = (obj) => {
      const flags = obj.flags;
      
      const isWrite = flags & 0b01000000;
      
      if (isWrite) tracks.writes += 1;
      else tracks.reads += 1;
      tracks.total += 1;
      
      
      const data = {};
 
      data.base = obj.addr;
      data.offset = obj.offset;
      data.addr = obj.addr + obj.offset;

      data.action = isWrite ? "write" : "read";

      data.type = ((BUILDER[flags & 0b00110000] ?? "U") || "S") + BUILDER[flags & 0b1111]
      


      // data.callstack = getCallstack(Error()); - MAJOR LAG  
      
      // messy, but faster than not messy
      data.value = exports.Module["HEAP" + (BUILDER[flags & 0b00110000] ?? "U") + BUILDER[flags & 0b1111]][(isWrite ? 1016 : data.addr) >> SHIFTS[flags & 0b1111]];
      
      for (let i = 0; i < recorders.length; ++i) recorders[i].update(data);
      
      history.unshift(data);
      
      history.length = CONFIG.MEM_HISTORY_SIZE;
      
      return
    }
    
    const recorders = watch.recorders = [];
    
    exports.on("watch:read", watcher);
    exports.on("watch:write", watcher);
    
    exports.watch.record = (amount=100, type="*") => { // all, read, or write
      type = type === "*" || type === "all" ? "total" : type === "read" ? "reads" : "writes";

      return new Promise((r) => {
        // maybe a class would be better... idc
        let i = 0;
        
        const recorder = {type, end: tracks[type] + amount, list: Array(amount)};
        
        recorder.delete = () => {
          
          recorders.splice(recorders.indexOf(recorder), 1);
          
          delete recorder.update;
          delete recorder.delete;
          r(recorder);
        }
        
        if (type === "total") {
          recorder.update = (obj) => {
            recorder.list[i++] = obj;
            
            if (tracks.total >= recorder.end) recorder.delete();
          }
        } else if (type === "reads") {
          recorder.update = (obj) => {
            if (obj.action !== "read") return;
            
            recorder.list[i++] = obj;
            
            if (tracks.reads >= recorder.end) recorder.delete();
          }
        } else {
          recorder.update = (obj) => {
            if (obj.action !== "write") return;
            
            recorder.list[i++] = obj;
            
            if (tracks.reads >= recorder.end) recorder.delete();
          }
        }
        
        recorders.push(recorder);
      });
    }
  })(exports.watch = {})
  
})(window[CONFIG.GLOBAL_KEY] = {});
