# Packet Encoding and Decoding

Also known as shuffling/unshuffling, this encryption system is what used to annoy many of the people brave enough to attempt headless botting. We have fully reverse-engineered every part of the encryption system and will discuss it below.

There are 4 things you need to know to understand the system:
1. Pseudo Random Number Generators
2. Header Jump Tables
3. Content Xor Tables
4. Praise M28

## Pseudo Random Number Generators

Pseudo random number generators are algorithms which generate sequences of numbers which seem random. For a more informative definition of a PRNG, check [Wikipedia](https://en.wikipedia.org/wiki/Pseudorandom_number_generator). Internal PRNGs within the game's wasm/memory are used to generate each packet's necessary values to encrypt or decrypt data. During each build, the seed and algorithm in each of the PRNGs used are modified slightly, that way they always seem random each build, but are actually quite predictable if you know what defines them.

### The Three Types
1. **Linear Congruential Generator**\
   Shortened to LCG, this type of PRNG is probably the most well known as it is also used in Java's native [Random](https://docs.oracle.com/javase/8/docs/api/java/util/Random.html) API. A basic implementation is shown since I don't want to explain everything about it here. Do your own research ([here's a wikipedia link](https://en.wikipedia.org/wiki/Linear_congruential_generator))
```js
class LCG extends PRNG {
    constructor(seed, multiplier, increment, modulus) {
        this.seed = seed;
        // these defining factors are all big ints, so that calculation is precise (the seed is an integer though)
        this._multiplier = multiplier;
        this._increment = increment;
        this._modulus = modulus;
    }
    next() {
        const nextSeed = (BigInt(this.seed >>> 0) * this._multiplier + this._increment) % this._modulus;

        this.seed = Number(nextSeed & 0xFFFFFFFFn) | 0; // safely convert to a signed integer

        return this.seed;
    }
}
```
\
2. **Xor Shift**\
   This type of PRNG XORs the seed by SHIFTed versions of itself every new generation. A basic implementation is shown, and [here's a wikipedia link](https://en.wikipedia.org/wiki/Xorshift). Do your own research
```js
class XorShift extends PRNG {
    constructor(seed, a, b, c) {
        this.seed = seed;

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
   This type of PRNG isn't standard (or wasn't found), but it is called the Triple LCG as it is 3 LCG's combined into one pseudo random number generator. As always, do your own research, but a code sample shown below
```js
class TripleLCG extends PRNG {
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

## Header Jump Tables

These are arrays of 128 bytes generated with PRNGs that are used to shuffle the headers of packets. In this section we will discuss how to generate these tables and how to use apply them onto incoming / outgoing headers.

The generation of a jump table is fairly simple, although something in the algorithm we reversed and will describe is off - unsure yet what exactly, but I will not investigate. First the client will generate an uint8 array of length 128, where each value is its index. Then the client will shuffle the array using [Fisher Yates shuffle algorithm](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle) and a PRNG. This PRNG is called the `jumpTableShuffler`, and its PRNG type as well as algorithm changes every new build. The result of this shuffling is the encryption jump table, and the decryption jump table is just an inverse of the table. A code sample is shown.
```js
function generateJumpTable() {
    const jumpTableShuffler = new PRNG(...);
    const table = new Uint8Array(128).map((_, i) => i);
    
    for (let i = 127; i >= 0; i--) {
        const index = ((jumpTableShuffler.next() >>> 0) % i) + 1;
        
        const temp = table[index];
        table[index] = table[i];
        table[i] = temp;
    }
    
    return {
        encryptionTable: table,
        decryptionTable: table.map((n, i, l) => l.indexOf(n))
    }
}
```

## Content Xor Tables

These are tables generated with PRNGs that are used to shuffle the content of packets. The generation of a jump table is simple and fully understood, and its application onto the packet content is even simpler.

## Praise M28

You'll notice that after parsing [`0x00` Update packets](./update.md), there are always a couple of seemingly random bytes at the end, unused by the actual parser. Well, when the first of these bytes is an odd integer, all the seeds used for clientbound decryption are incremented by 28. We have called this process **Praise M28** accordingly.
