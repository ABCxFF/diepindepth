// Idk how to express this in c so

/** @global {malloc} */
/** @global {free} */
const cstr = {};

cstr.read = function(buffer, addr) {
  const HEAPU8 = new Uint8Array(buffer);
  const HEAP32 = new Int32Array(buffer);

  let strAt = addr;
  let length = HEAPU8[addr + 11]
  if (length === 0x80) {
    length = HEAP32[(addr + 4) >> 2];
    strAt = HEAP32[addr >> 2];
  }
          
  return new TextDecoder().decode(HEAPU8.subarray(strAt, strAt + length))
}

cstr.write = function(buffer, addr, string) {
  string = String(string);

  const HEAPU8 = new Uint8Array(buffer);
  const HEAP32 = new Int32Array(buffer);
  
  const textBuf = new TextEncoder().encode(string + '\00');
  const len = string.length;

  if (HEAPU8[addr + 11] === 0x80) free(HEAP32[addr >> 2]);

  if (len < 11) {
    if (HEAPU8[addr + 11] === 0x80) {
      HEAPU8.set(new Uint8Array(12), addr); // clear
    }

    HEAPU8.set(textBuf, addr);

    HEAPU8[addr + 11] = len;
  } else {
    const strPtr = malloc(len + 1);

    HEAPU8.set(textBuf, strPtr);
    HEAP32.set([strPtr, len, -0x7FFFFFE0], addr >> 2);
  }
}
