// Explains itself? Kind of a standard way of storing data, but this is its format in emscripten compiled binaries
struct Vector {
    uint32_t startPtr;

    uint32_t endPtr;

    uint32_t endPtrCapacity;
}
