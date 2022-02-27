/*
    Bin View structs are used for reading
    content, byte by byte, out of a series
    of bytes. `BinView`s take up 12 bytes.

    It might be worth noting, `BinView`s
    are almost always initalized inside a
    stackframe, not the heap.

    In Emscripten, Pointers are 32 bit.
*/
struct BinView {
    // Content @00
    // - Points to a series of bytes (packet)
    uint8_t* content;

    // Content Length @04
    // - The number of bytes in Content
    int32_t content_len;

    // Position @08
    // - Position being read in the bytes
    // - Think of it like reader.at in a packet Reader
    int32_t pos;
};
