> For other information: [check out shädam's cool article](https://github.com/supahero1/diep.io/tree/master/working-with-diep) (shädam is cool) - it discusses packet encoding

# Packet Encoding and Decoding

Also known as shuffling/unshuffling, this encryption system is what annoys 80% of all the people who deal with Diep protocol. No one has fully reverse-engineered every part of the encryption system, but Shädam got close and was able to reverse-engineer (for the most part) packet opcode/header encodings, and content encodings. Some of his old code is visible in a repository on his account.

> Add some broad statements here

There are 4 parts to packet encryption:
1. Jump Table Generation
2. Packet Header Encryption
3. Packet Content Encryption
4. Encryption Cycle Reset `(name change pending)`

## Jump Table Generation

The jump table is an array of indexes, from 0 to 127 (inclusive), shuffled using the [Fisher Yates shuffle algorithm](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle), using a pseudo random number generator present within the game, who's seed changes every build. The following is an example of its generation in javascript:
```js
const prng = new PRNG(SEED, A, B, C);
const table = new Uint8Array(128).map((_, i) => i);

for (let i = 127; i >= 0; i--) {
  const index = ((prng.next() >>> 0) % i) + 1;
    
  const temp = table[index];
  table[index] = table[i];
  table[i] = temp;
}
```

## Packet Header Encryption

Headers of packets are encoded using a table of jumps stored in memory. First, a pseudo random number generator within the game determines how many jumps to jump from, to get the encoded header.

## Packet Content Encryption

> the *n* length xor tables, how they're generated

## Encryption Cycle Reset

> Not sure
