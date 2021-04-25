# Build Archives
Although the goal is to be able to fetch and parse all data from any build at any time, its still smart keep some data archived.

Abstract Format:
```py
utf8(build) length=40 or 20 # build hash
[
  ...{
    u8(entry type id)
    i32(entry data size)
    bytes[entry data size] # bytes are to be read based on the entry type, the amount of bytes is defined by entry data size
  } # entries are read until the magic bytes (size - 4)
]
utf8("ABC\xFF") # magic bytes at the end
```
