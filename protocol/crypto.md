> For other information: [check out shädam's cool article](https://github.com/supahero1/diep.io/tree/master/working-with-diep) (shädam is cool) - it discusses packet encoding

# Packet Encoding and Decoding

Also known as shuffling/unshuffling, this encryption system is what annoys 80% of all the people who deal with Diep protocol. No one has fully reverse-engineered every part of the encryption system, but Shädam got close and was able to reverse-engineer (for the most part) packet opcode/header encodings, and content encodings. Some of his old code is visible in a repository on his account.

> Add some broad statements here

There are 3 parts to packet encryption:
1. Magic Number and Jump Table `(name change pending)`
2. Packet Content Encryption
3. Packet Header Encryption
4. Encryption Cycle Reset `(name change pending)`

> Or add some broad statements here

## Magic Number and Jump Table

> Discuss where the jump tables are in the memory, where the magic number is in the memory

## Packet Content Encryption

> the *n* length xor tables, how they're generated

## Packet Header Encryption

> the jump tables

## Encryption Cycle Reset

> Not sure
