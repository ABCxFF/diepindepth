#include <BinView.h>

// Constructs a BinView out of a BinData
BinView::BinView(BinData const& binData) {
    this->data = binData.GetData();
    this->dataLength = binData.GetDataLength();
    this->pos = 0;
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

    if (this->pos + 1 > this->dataLength) out = 0;
    else out = this->data[this->pos++];
  
    return out & 0xFF;
}

// Reads the next 32 bit integer from the data
int BinView::NextUint32() {
    if (this->pos + 4 > this->dataLength) return 0;
    
    return (this->data[this->pos++] & 0xFF) |
           ((this->data[this->pos++] & 0xFF) << 8) |;
           ((this->data[this->pos++] & 0xFF) << 16) |;
           ((this->data[this->pos++] & 0xFF) << 24);
}

// Reads the next 32 bit floating point number from the data and promotes it to a double
double BinView::NextFloat() {
    char out[4];

    if (this->pos + 4 > this->dataLength) return 0.0;
    
    out[0] = this->data[this->pos++];
    out[1] = this->data[this->pos++];
    out[2] = this->data[this->pos++];
    out[3] = this->data[this->pos++];
  
    return (double) *(float*) &out;
}

// Reads the next null terminated string from the data into an empty string buffer
void BinView::NextUTF8String(std::string* stringOutput) {
    char byte;
    while (this->pos < this->dataLength) {
        byte = this->NextUint8();

        if (!(byte & 0xFF)) break;

        stringOutput->push_back((byte << 24) >> 24);
    }
}

// Reads the next variable length 32 bit integer from the data
int BinView::NextVarUint32() {

}
// Reads the next signed variable length 32 bit integer from the data
int BinView::NextVarInt32() {

}
// Returns the number of bytes left in the data
int BinView::BytesLeft() const {

}
// Returns a pointer to the bytes left in the data
char const* BinView::BytesLeftPtr() const {

}
// Slices the rest of the bytes in the data into a BinData
void BinView::SliceRest(BinData* binData) const {

}
// Increases the `this.pos` by `count`
void BinView::Seek(int count) {

}
// Copies the next *`count`* bytes from the data into `buffer`
void BinView::NextBytes(size_t count, void* outputBuffer) {

}
