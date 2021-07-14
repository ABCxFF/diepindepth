/*
    Vectors store elements of data efficiently(?).
    Vectors are 12 bytes of size
    
    In Emscripten, Pointers are 32 bit.
*/

// Explains itself? Kind of a standard way of storing data, but this is its format in emscripten compiled binaries

struct vector {
    void* start;

    void* used_end; // Denotes how much of the total space is used (used_end - start)

    void* size_end; // Denotes the absolute space that the vector has allocated (size_end - start)
};
