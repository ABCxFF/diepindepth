// ==UserScript==
// @name         Diep Memory Analyzer
// @version      Beta 1.0.0
// @description  Script dedicated to reverse engineering memory structs and analyzing the memory - beta version only
// @namespace    github.com/ABCxFF
// @author       ABC
// 
// @match        *://diep.io/
// @run-at       document-start
// @grant        none
// 
// @require      https://gist.githubusercontent.com/ABCxFF/b089643396fbb933996966b5ab632821/raw/fb58491af8d2839945aa616caf9ad5a1b97dcd61/wail.js
// ==/UserScript==

/**
Copyright 2021 ABC - github.com/ABCxFF
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

const CONFIG = {
  GLOBAL_KEY: "DMA",
}

!((exports) => {
  !((listeners) => {
    exports.on = (event, cb) => {
      if (!listeners[event]) listeners[event] = [];

      return listeners[event].push(cb) - 1;
    }

    exports.off = (event, index) => {
      if (!listeners[event] || index < 0) return;

      listeners[event].splice(index, 1);
    }

    exports.once = (event, cb) => {
      let i = exports.on(event, (...data) => {
        cb(...data);
        exports.off(i);
      })
    }

    exports.emit = (event, ...data) => {
      if (!listeners[event]) return;

      for (const cb of listeners[event]) cb(...data);
    }
    
    exports.inverseEmit = (event, ...data) => {
      if (!listeners[event]) return;

      for (const cb of listeners[event]) cb(...data);
    }
  })({});

  const storage = (() => {
    const key = CONFIG.GLOBAL_KEY + "Store";
    
    const storage = exports.storage = {};
    
    storage.store = (data=storage._cache) => localStorage.setItem(key, JSON.stringify(storage._cache = data));
    storage.fetch = () => storage._cache = JSON.parse(localStorage.getItem(key) || "{}");
    storage.wipe = () => storage.store({});
    
    storage._cache = storage.fetch();
    
    return storage;
  })();

  Object.defineProperty(Object.prototype, "postRun", {
    get() { },
    set(postRun) {
      delete Object.prototype.postRun
      this.postRun = postRun;
      
      exports.Module = this;
      
      const stack = Error().stack;
      let bIndex = stack.lastIndexOf("build_") + 6;
      
      exports.BUILD = stack.slice(bIndex, stack.indexOf(".", bIndex));
      
      if (exports.BUILD !== storage.fetch().build) {
        prompt(CONFIG.GLOBAL_KEY + ": New build, wiping settings\n\nbuild_" + exports.BUILD, JSON.stringify(storage.fetch()));
        
        storage.wipe();
        storage.fetch().build = exports.BUILD;
        storage.store();
      }
      exports.emit("load");
    },
    configurable: true,
  });
  

  !(_inst => WebAssembly.instantiate = (wasm, imports) => {
    if (imports && imports.a) {
      const loader = {buffer: new Uint8Array(wasm), imports};
      imports.a[CONFIG.GLOBAL_KEY.toLowerCase() + ".patch"] = () => {};
      exports.emit("precompile", loader);
      
      WebAssembly.instantiate = _inst;
      
      return _inst(loader.buffer, loader.imports).then((results) => {
        exports.emit("compile", results.instance.exports, results);
        
        return results;
      });
    }
    
    return _inst(wasm, imports);
  })(WebAssembly.instantiate.bind(WebAssembly.instantiate));

  exports.addExportEntry = (name, index) => {
    const exportEntries = storage.fetch().exports || [];
    
    exportEntries.push({name, index});
    storage.fetch().exports = exportEntries;
    storage.store();

    return index;
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
  
  exports.addLogPoint = (logName, index) => {
    const loggers = storage.fetch().loggers || [];
    
    loggers.push({name: logName, index});
    storage.fetch().loggers = loggers;
    storage.store();

    return index;
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

  exports.once("compile", (wasmExports, results) => {
    exports.wasm = {}
    exports.wasm.results = results;
    for (const name in wasmExports) if (name.slice(0, 5) === "diep.") exports.wasm[name.slice(5)] = wasmExports[name];
  });
  
  exports.once("precompile", (loader) => {
    const parserWail = new WailParser(loader.buffer);
    parserWail.parse();
    
    const parsed = parserWail._parsedSections;

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
    
    // ode to cx
    wail.addImportEntry({
      moduleStr: "actually know wasm",
      fieldStr: CONFIG.GLOBAL_KEY.toLowerCase() + ".patch",
      kind: "func",
        type: wail.addTypeEntry({
        form: "func",
        params: [],
      })
    });
    
    wail.parse();
    
    loader.buffer = wail.write();
  });
  
  exports.once("precompile", () => {
    const {
      HEAPU8,  HEAP8,  HEAPU16, HEAP16, 
      HEAPU32, HEAP32,
      HEAPF32, HEAPF64,
      _malloc: malloc, _free: free
    } = exports.Module;
    
    const HEAPU64 = exports.Module.HEAPU64 = new BigUint64Array(HEAPU8.buffer);
    const HEAP64 = exports.Module.HEAP64 = new BigInt64Array(HEAPU8.buffer);
    
    exports.HEAPU8 = HEAPU8;
    exports.HEAP8 = HEAP8;
    exports.HEAPU16 = HEAPU16;
    exports.HEAP16 = HEAP16;
    exports.HEAPU32 = HEAPU32;
    exports.HEAP32 = HEAP32;
    exports.HEAPF32 = HEAPF32;
    exports.HEAPF64 = HEAPF64;
    exports.HEAP64 = HEAP64;
    exports.HEAPU64 = HEAPU64;
    exports.malloc = malloc;
    exports.free = free;
  });
  
  
  // Highly based off of the original DPMA pointer.js
  // github.com/CX88/diepssect/blob/master/dpma/src/pointer.js
  exports.$ = () => {throw "Exports not ready yet"};
  exports.once("precompile", () => {
    const {
      HEAPU8,  HEAP8,  HEAPU16, HEAP16, 
      HEAPU32, HEAP32,
      HEAPF32, HEAPF64,
      HEAP64, HEAPU64,
      _malloc: malloc, _free: free
    } = exports.Module;
    
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
          console.warn("Invalid property");
          break;
      }
      
      return true;
    }

    exports.$ = ptr => new Proxy({ ptr }, { get: getter, set: setter })
  });
  
  
  exports.scan = (() => {
    const scan = (arr, needle, max=500) => {
      const results = [];
      if (needle.length <= 0 || arr.length < needle.length) return results;
      
      const needleLen = needle.length;
      const len = arr.length - needleLen;

      jumper: for (let i = arr.indexOf(needle[0]); i <= len && i !== -1 && results.length < max; i = arr.indexOf(needle[0], i + 1)) {
        for (let j = 1; j < needleLen; ++j) if (needle[j] !== arr[i + j]) continue jumper;

        results.push(i);
      };

      return results;
    };
    
    exports.once("precompile", () => {
      const {
        HEAPU8,  HEAP8,  HEAPU16, HEAP16, 
        HEAPU32, HEAP32,
        HEAPF32, HEAPF64,
        HEAP64, HEAPU64,
      } = exports.Module;

      const Encoder = new TextEncoder();

      const arrayify = (v) => [v].flat();
      
      exports.scan.i8 = (vals, max=500) => scan(HEAP16, arrayify(vals).map(v => (v << 24) >> 24), max).map(i => i << 1);
      exports.scan.u8 = (vals, max=500) => scan(HEAPU16, arrayify(vals).map(v => (v << 24) >>> 24), max).map(i => i << 1);
      
      exports.scan.i16 = (vals, max=500) => scan(HEAP16, arrayify(vals).map(v => (v << 16) >> 16), max).map(i => i << 1);
      exports.scan.u16 = (vals, max=500) => scan(HEAPU16, arrayify(vals).map(v => (v << 16) >>> 16), max).map(i => i << 1);
      
      exports.scan.i32 = (vals, max=500) => scan(HEAP32, arrayify(vals).map(v => v | 0), max).map(i => i << 2);
      exports.scan.u32 = (vals, max=500) => scan(HEAPU32, arrayify(vals).map(v => v >>> 0), max).map(i => i << 2);
      
      exports.scan.f32 = (vals, max=500) => scan(HEAPF32, arrayify(vals).map(Math.fround), max).map(i => i << 2);
      exports.scan.f64 = (vals, max=500) => scan(HEAPF64, arrayify(vals), max).map(i => i << 3);
      
      exports.scan.i64 = (vals, max=500) => scan(HEAP64, arrayify(vals).map(v => v & 0x8000000000000000n ? ~(v & 0x7FFFFFFFFFFFFFFFn) : v & 0x7FFFFFFFFFFFFFFFn), max).map(i => i << 3);
      exports.scan.u64 = (vals, max=500) => scan(HEAPU64, arrayify(vals).map(v => v & 0x8000000000000000n && v < 0n ? ~(v & 0x7FFFFFFFFFFFFFFFn) : v & 0x7FFFFFFFFFFFFFFFn), max).map(i => i << 3);
      
      exports.scan.raw = (bytes, max=500) => scan(HEAPU8, bytes, max);
      exports.scan.utf8 = (string, max=500) => {
        const rawBuf = Encoder.encode(string);
        const ntBuf = new Uint8Array(rawBuf.byteLength + 1);
        ntBuf.set(rawBuf);
        
        return scan(HEAPU8, ntBuf, max);
      }
    })
    
    return {_internal: scan};
  })();
  
})(window[CONFIG.GLOBAL_KEY] = {});
