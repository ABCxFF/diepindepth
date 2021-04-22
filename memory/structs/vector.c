/*
    Vectors store elements of data efficiently(?).
    Vectors are 12 bytes of size
    
    In Emscripten, Pointers are 32 bit.
*/

// Explains itself? Kind of a standard way of storing data, but this is its format in emscripten compiled binaries
struct vector {
    uint32_t startPtr;

    uint32_t endPtr;

    uint32_t endPtrCapacity;
}
