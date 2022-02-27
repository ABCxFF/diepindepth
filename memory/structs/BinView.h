/*
    Bin View structs are used for reading
    packets, byte by byte, out of a series
    of bytes. `BinView`s take up 12 bytes.

    It might be worth noting, `BinView`s
    are almost always initalized inside a
    stackframe, not the heap.

    In Emscripten, Pointers are 32 bit.
*/
struct BinView {
    // Packet @00
    // - Points to a series of bytes (packet)
    uint8_t* packet;

    // Packet Length @04
    // - The number of bytes in Packet
    int32_t packet_len;

    // Position @08
    // - Position being read in the bytes
    // - Think of it like reader.at in a packet Reader
    int32_t pos;
};
