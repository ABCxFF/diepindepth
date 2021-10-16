/*
    Vectors store elements of data efficiently(?).
    Vectors are 12 bytes of size
    
    In Emscripten, Pointers are 32 bit.
*/

// Explains itself? Kind of a standard way of storing data, but this is its format in emscripten compiled binaries
struct vector {
    void* start; // Points to the start of the elements contained - @00

    void* end; // Denotes how much of the total space is used (end - start) - @04

    void* end_capacity; // Denotes the absolute space that the vector has allocated (end_capacity - start) - @08
};
