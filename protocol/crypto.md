# Packet Encoding and Decoding

Also known as shuffling/unshuffling, this encryption system is what used to annoy many of the people brave enough to attempt headless botting. For each packet, a newly generated XOR table is used to shuffle/unshuffle the packet. The header jump table stays constant and does not change for every packet. We have fully reverse-engineered every part of the encryption system and will discuss it below.

There are 4 things you need to know to understand the system:
1. Pseudo Random Number Generators
2. Header Jump Tables
3. Content Xor Tables
4. Praise M28

## Pseudo Random Number Generators

Pseudo random number generators are algorithms which generate sequences of numbers which seem random. For a more informative definition of a PRNG, check [Wikipedia](https://en.wikipedia.org/wiki/Pseudorandom_number_generator). Internal PRNGs within the game's wasm/memory are used to generate each packet's necessary values to encrypt or decrypt data. During each build, the seed and algorithm in each of the PRNGs used are modified slightly. That way, they always seem random each build, but they are actually quite predictable if you know what defines them.

### The Three Types
1. **Linear Congruential Generator**\
   Shortened to LCG, this type of PRNG is probably the most well known as it is also used in Java's native [Random](https://docs.oracle.com/javase/8/docs/api/java/util/Random.html) API. A basic implementation is shown since it would take a great deal of time to explain. Do your own research ([here's a wikipedia link](https://en.wikipedia.org/wiki/Linear_congruential_generator)).
```ts
class LCG implements PRNG {
    constructor(seed, multiplier, increment, modulus) {
        this.seed = seed;
        // these defining factors are all big ints, so that calculation is precise (the seed is an integer though)
        this._multiplier = multiplier;
        this._increment = increment;
        this._modulus = modulus;
    }
    next() {
        const nextSeed = (BigInt(this.seed >>> 0) * this._multiplier + this._increment) % this._modulus;

        this.seed = Number(nextSeed & 0xFFFFFFFFn) | 0; // safely convert to a 32 bit integer

        return this.seed;
    }
}
```
\
2. **Xor Shift**\
   This type of PRNG XORs the seed by SHIFTed versions of itself every new generation. A basic implementation is shown and [here's a wikipedia link](https://en.wikipedia.org/wiki/Xorshift). Do your own research.
```ts
class XorShift implements PRNG {
    constructor(seed, a, b, c) {
        this.seed = seed;

        // the actual shifts
        this._a = a;
        this._b = b;
        this._c = c;
    }
    next() {
        this.seed ^= this.seed << this._a;
        this.seed ^= this.seed >>> this._b;
        this.seed ^= this.seed << this._c;

        return this.seed;
    }
}
```
\
3. **Triple LCG**\
   This type of PRNG isn't standard (or wasn't found), but we have called it the Triple LCG since it is 3 separate LCG's combined into one pseudo random number generator. As always, do your own research (in the game's wasm), but a code sample shown below.
```ts
class TripleLCG implements PRNG {
    constructor(a, b, c) {
        this.lcgA = new LCG(a.seed, a.multiplier, a.increment, 0x100000000n);
        this.lcgB = new LCG(b.seed, b.multiplier, b.increment, 0x100000000n);
        this.lcgC = new LCG(c.seed, c.multiplier, c.increment, 0x100000000n);
    }

    next() {
        const a = this.lcgA.next();
        const b = this.lcgB.next();
        const c = this.lcgC.next();

        return (a + b + c) | 0;
    }
}
```  

## Header Jump Tables (s-box)
> The technical, cryptographic term for this structure is a Subsitution Box, s-box for short.

These are arrays of 128 bytes generated with PRNGs that are used to shuffle the headers of packets. In this section we will discuss how to generate these tables and how to use / apply them to incoming / outgoing headers.

The generation of a jump table is fairly simple. First, the client will generate an uint8 array of length 128, where each value is its index. Then, the client will shuffle the array using the [Fisher Yates shuffle algorithm](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle) and a PRNG. This PRNG is called the `jumpTableShuffler`, and its PRNG type as well as algorithm seeds change every new build.

It is worth noting that the clientbound and serverbound jump tables differ slightly. As known, the 0x00 serverbound packet is never shuffled, and hence it should be impossible for any header to ever, after being encoded, become a 0x00 packet by accident. For this reason, only indices 1 - 127 inclusive are actually shuffled, so that 0, and only 0, jumps to 0. In the clientbound jump table though, the 0x01 packet must be preserved. So, after shuffling the entire jump table (0 - 128 inclusive), the game searches for the number 1 inside of the shuffled table, and swaps it with the element at index 1. Finally, to get the decryption jump table of any such encryption jump table, you must inverse it. A code sample is shown.
```ts
function generateJumpTable(isClientBound: boolean) {
    const jumpTableShuffler = new PRNG(...);
    const table = new Uint8Array(128).map((_, i) => i);
    
    for (let i = 127; i >= 1; i--) {
        const index = ((jumpTableShuffler.next() >>> 0) % (isClientBound ? i + 1 : i)) + (isClientBound ? 0 : 1);
        
        const temp = table[index];
        table[index] = table[i];
        table[i] = temp;
    }
    
    if (isClientBound) {
        table[table.indexOf(1)] = table[1];
        table[1] = 1;
    }
    
    return {
        encryptionTable: table,
        decryptionTable: table.map((n, i, l) => l.indexOf(i))
    }
}
```
\
To apply a jump table on a packet header (to encrypt it), you must "jump" or subsitute from value to value a certain number of times, then return the final jump/substitution. Another internal PRNG, which we've named `jumpCount`, is made (one for encryption and decryption) to determine the number of times it subsitutes/jumps. A full example of this is shown.
```ts
// This example is only encryption, pretty obvious how to change to decryption though.
const jumpCountPRNG = new PRNG(...);

function encryptHeader(header: number, isClientBound: boolean) {
    const { encryptionTable } = generateJumpTable(isClientBound: boolean);
    const jumpCount = (jumpCountPRNG.next() >>> 0) % 16;
    let position = header;

    for (let i = 0; i <= jumpCount; i++) position = encryptionTable[position];

    return position;
}
```

## Content Xor Tables

These are tables generated with PRNGs that are used to shuffle the content of packets. The generation of a xor table is simple and fully understood, and its application onto the packet content is even simpler. 

The generation of xor tables are similar to the generation of a jump table, except the values of the initial, unshuffled table are not just their index in the array but instead, each value is generated from another PRNG, which we've called the `xorTable` PRNG. The length of the xor table changes every build, and the length is not the same for serverbound and clientbound packets - an unrelated cryptographic system is used for each. As for the shuffling of the xor table, it the [Fisher Yates shuffle algorithm](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle) yet again. Code sample shown
```js
const XOR_TABLE_SIZE = ...; // Changes per build
const xorTablePRNG = new PRNG(...);
const xorTableShuffler = new PRNG(...);

function generateXorTable() {
    const table = new Uint8Array(XOR_TABLE_SIZE).map((_, i) => xorTablePRNG.next());
    
    for (let i = XOR_TABLE_SIZE - 1; i >= 0; i--) {
        const index = (xorTableShuffler.next() >>> 0) % (i + 1);
        
        const temp = table[index];
        table[index] = table[i];
        table[i] = temp;
    }
    
    // Due to how the table is applied, the same table can be used for both decryption and encryption.
    // Read the next passage for more information.
    return table;
}
```
\
All you need to do to apply an xor table to a packet is XOR each byte in the xor table with the corresponding byte in the packet, excluding the header. See below.

```ts
export function encryptPacket(packet: Uint8Array, isClientBound: boolean): void {
    // Ignored packets = Incoming 0x01, Outgoing 0x00.
    if (isClientbound && packet[0] === 0x01) return;
    if (!isClientbound && packet[0] === 0x00) return;

    packet[0] = encryptHeader(packet[0], isClientBound);

    const xorTable = generateXorTable();
    for (let i = 1; i < packet.length; i++) packet[i] ^= xorTable[i % XOR_TABLE_SIZE];
}
```

## Praise M28

You'll notice that after parsing [`0x00` Update packets](./update.md), there are always a couple of seemingly random bytes at the end, unused by the actual parser. When the first of these bytes is an odd integer, all the seeds used for clientbound decryption are incremented by 28. We have called this process **Praise M28** accordingly.
