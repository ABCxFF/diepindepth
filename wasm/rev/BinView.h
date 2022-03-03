// Thank you 0x1412 and Crabby for helping with C++
#include <cstddef>
#include "BinData.h"

class BinView {
private:
    // Points to a series of bytes
    const char* data;

    // The number of bytes in the data
    int dataLength;
  
    // Current position being read from in the data 
    int pos;

public:
    // Constructs a BinView out of a BinData
    BinView(BinData const& binData);
    // Constructs a BinView out of a data pointer and length
    BinView(char const* data, size_t dataLength);
  
    // Reads the next 8 bit integer from the data
    int NextUint8();
    // Reads the next 32 bit integer from the data
    int NextUint32();
    // Reads the next 32 bit floating point number from the data and promotes it to a double
    double NextFloat();
    // Reads the next null terminated string from the data into an empty string buffer
    void NextUTF8String(std::string* stringOutput); // May be a bit inaccurate - Crabby is verifying
    // Reads the next variable length 32 bit integer from the data
    int NextVarUint32();
    // Reads the next signed variable length 32 bit integer from the data
    int NextVarInt32();

    // Returns the number of bytes left in the data
    int BytesLeft() const;
    // Returns a pointer to the bytes left in the data
    char const* BytesLeftPtr() const;
    // Slices the rest of the bytes in the data into a BinData
    void SliceRest(BinData* binData) const;
  
    // Increases the `this.pos` by `count`
    void Seek(int count);
    // Copies the next *`count`* bytes from the data into `buffer`
    void NextBytes(size_t count, void* outputBuffer);
};
