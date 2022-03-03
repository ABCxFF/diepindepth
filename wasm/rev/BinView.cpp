#include "BinView.h" 

// Constructs a BinView out of a BinData
BinView::BinView(BinData const& binData) {
    data = binData.GetData();
    dataLength = binData.GetDataLength();
    pos = 0;
}

// Constructs a BinView out of a data pointer and length
BinView::BinView(char const* data, size_t dataLength) {
    this->data = data;
    this->dataLength = dataLength;
    this->pos = 0;
}

// Reads the next 8 bit integer from the data
int BinView::NextUint8() {
    char out;

    if (pos + 1 > dataLength) out = 0;
    else out = data[pos++];
  
    return out;
}

// Reads the next 32 bit integer from the data
int BinView::NextUint32() {
    if (pos + 4 > dataLength) return 0;
    
    return data[pos++] |
           (data[pos++] << 8) |
           (data[pos++] << 16) |
           (data[pos++] << 24);
}

// Reads the next 32 bit floating point number from the data and promotes it to a double
double BinView::NextFloat() {
    char out[4];

    if (pos + 4 > dataLength) return 0.0;
    
    out[0] = data[pos++];
    out[1] = data[pos++];
    out[2] = data[pos++];
    out[3] = data[pos++];
  
    return (double) *(float*) &out;
}

// Reads the next null terminated string from the data into an empty string buffer
std::string BinView::NextUTF8String() {
    std::string out;
    char byte;
    
    while (pos < dataLength) {
        byte = NextUint8();

        if (byte == 0) break;

        out.push_back(byte);
    }

    return out;
}

// Reads the next variable length 32 bit integer from the data
int BinView::NextVarUint32() {
    int byte, i, out;

    out = 0;
    i = 0;
    while (true) {
        byte = NextUint8();
        out |= byte << i;
        i += 7;
        if (byte & 0x80 == 0) break;
        if (i >= 32) break;
        if (BytesLeft() <= 0) break;
    }
    
    return out;
}

// Reads the next signed variable length 32 bit integer from the data
int BinView::NextVarInt32() {
    int unsignedValue;
    unsignedValue = NextVarUint32();
    return (unsignedValue >>> 0) ^ (0 - (unsignedValue & 1));
}

// Returns the number of bytes left in the data
int BinView::BytesLeft() const {
    return dataLength - pos;
}

// Returns a pointer to the bytes left in the data
char const* BinView::BytesLeftPtr() const {
    return &data[pos];
}

// Slices the rest of the bytes in the data into a BinData
// - (thank you 1412 for help cracking this)
BinData BinView::SliceRest(void* binData) const {
    return { BytesLeftPtr(), BytesLeft() };
}

// Increases the `this.pos` by `count`
void BinView::Seek(int count) {
    pos += count;
}

// Copies the next *`count`* bytes from the data into `buffer`
void BinView::NextBytes(size_t count, void* outputBuffer) {
    if (BytesLeft() < count) return;
    
    memcpy(outputBuffer, BytesLeftPtr(), count);
    Seek(count);
}
