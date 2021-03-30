/*
   Copyright 2020 github.com/ABCxFF

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

const convo = new ArrayBuffer(4);
const u8 = new Uint8Array(convo);
const u16 = new Uint16Array(convo);
const i32 = new Int32Array(convo);
const u32 = new Uint32Array(convo);
const f32 = new Float32Array(convo);

const UTF8 = (() => {
    const Decoder = new TextDecoder();
    const Encoder = new TextEncoder();

    return {
        encode: (...args) => Encoder.encode(...args),
        encodeInto: (text, buf) => Encoder.encodeInto(text, buf),
        decode: (...args) => Decoder.decode(...args)
    }
})();

class Reader {
    constructor(buf = 0) {
        this.at = 0;
        this.buffer = new Uint8Array(new Uint8Array(buf));
    }
    static endianSwap(num) {
        return ((num & 0xFF) << 24) | ((num & 0xFF00) << 8) | ((num >> 8) & 0xFF00) | ((num >> 24) & 0xFF);
    }
    u8() {
        return this.buffer[this.at++];
    }

    vu(endianSwap = false) {
        let out = 0;
        let i = 0;
        while (this.buffer[this.at] & 0x80) {
            out |= (this.buffer[this.at++] & 0x7F) << i;
            i += 7;
        }
        out |= (this.buffer[this.at++] & 0x7F) << i;

        if (endianSwap) out = Reader.endianSwap(out);

        return out;
    }

    vi(endianSwap = false) {
        let out = this.vu(endianSwap);

        return (0 - (out & 1)) ^ (out >>> 1);
    }

    vf(endianSwap = false) {
        i32[0] = Reader.endianSwap(this.vi())
        if (endianSwap) i32[0] = Reader.endianSwap(i32[0]);
        return f32[0]
    }

    cstr() {
        let end = this.buffer.indexOf(0, this.at)
        let out = UTF8.decode(this.buffer.slice(this.at, end));
        this.at = end + 1;
        return out;
    }
    string(length = this.vu()) {
        return UTF8.decode(this.buffer.slice(this.at, this.at += length));
    }
    float(endianSwap = false) {
        u8.set(this.buffer.subarray(this.at, this.at += 4));
        if (endianSwap) i32[0] = Reader.endianSwap(i32[0]);
        return f32[0];
    }
    f32(endianSwap = false) {
        return this.float(endianSwap);
    }
    u16() {
        u8.set(this.buffer.subarray(this.at, this.at += 2));
        return u16[0];
    }
    u32(endianSwap = false) {
        u8.set(this.buffer.subarray(this.at, this.at += 4));
        if (endianSwap) return Reader.endianSwap(u32[0]);
        return u32[0];
    }
    i32(endianSwap = false) {
        u8.set(this.buffer.subarray(this.at, this.at += 4));
        if (endianSwap) return Reader.endianSwap(u32[0]);
        return i32[0];
    }
    entid() {
        if (this.buffer[this.at] === 0) return (this.at++, { hash: 0, toString() { return null } });
        return {
            hash: this.vu(),
            id: this.vu(),
            hashString() {
                return this.hash + "#" + this.id;
            },
            toString() {
                return `<${this.hash}, ${this.id}>`;
            }
        }
    }
    _table(type, name) {
        return this.xorTable((i) => ({
            index: i,
            name,
            val: this[type]()
        }));
    }

    array(length, read, thisArg=this) {
        let arr = [];
        for (let i = 0; i < length; i++) {
            arr[i] = read.call(thisArg);
        }
        return arr
    }

    xorTable(read) {
        let table = [];

        let index = -1;
        let currentJump = 0;
        while (true) {
            currentJump = this.vu() ^ 1;
            if (!currentJump) break;
            index += currentJump;
            table[table.length++] = read.call(this, index);
        }

        return table;
    }


    hexStr(len = 40) {
        return Array.from(this.buffer.slice(this.at, this.at + len)).map(byte => (byte | 0x100).toString(16).slice(1)).join(' ');
    }
}

class Writer {
    constructor() {
        this.at = 0;
        this.blocks = [];
    }
    u8(val) {
        this.blocks[this.blocks.length++] = new Uint8Array([val]);
        return this;
    }
    u16(val) {
        u16[0] = val;
        this.blocks[this.blocks.length++] = new Uint8Array(u8.subarray(0, 2));
        return this;
    }
    i32(val, endianSwap = false) {
        if (endianSwap) val = Reader.endianSwap(val);

        i32[0] = val;
        this.blocks[this.blocks.length++] = new Uint8Array(u8);
        return this;
    }
    u32(val, endianSwap = false) {
        if (endianSwap) val = Reader.endianSwap(val);

        u32[0] = val;
        this.blocks[this.blocks.length++] = new Uint8Array(u8);
        return this;
    }
    f32(val, endianSwap = false) {
        f32[0] = val;

        if (endianSwap) i32[0] = Reader.endianSwap(i32[0]);

        this.blocks[this.blocks.length++] = new Uint8Array(u8);
        return this;
    }
    float(val, endianSwap = false) {
        return this.f32(val, endianSwap);
    }
    vf(val, endianSwap = false) {
        f32[0] = val;

        if (endianSwap) i32[0] = Reader.endianSwap(i32[0]);

        return this.vi(Reader.endianSwap(i32[0]));
    }
    vu(val, endianSwap = false) {
        if (endianSwap) val = Reader.endianSwap(val);
        let buf = new Uint8Array(4);
        let at = 0;
        do {
            let part = val;
            val >>>= 7;
            if (val) part |= 0x80;
            buf[at++] = part;
        } while (val)
        this.blocks[this.blocks.length++] = buf.slice(0, at);

        return this;
    }
    vi(val, endianSwap = false) {
        return this.vu((0 - (val < 0)) ^ (val << 1), endianSwap);
    }
    raw(...data) {
        this.blocks[this.blocks.length++] = new Uint8Array(data);
        return this;
    }
    cstr(str) {
        let bytes = new Uint8Array(str.length + 1);
        UTF8.encodeInto(str, bytes);
        this.blocks[this.blocks.length++] = bytes;
        return this;
    }
    string(str) {
        this.vu(str.length);
        this.blocks[this.blocks.length++] = UTF8.encode(str);
        return this;
    }
    write() {
        let len = 0;
        for (let block of this.blocks) {
            len += block.byteLength;
        }
        let at = 0;
        let outBuf = new Uint8Array(len);
        for (let block of this.blocks) {
            outBuf.set(block, at);
            at += block.byteLength;
        }
        return outBuf;
    }
}


module.exports = { Reader, Writer };
