# Memory

This folder will serve as a source of information relating to LLVM's way of organizing the memory of a wasm32 program, as well as the way Diep's developer (Zeach) structured his game's memory.

## LLVM

LLVM's memory is layed out similarly to how a real computer lays out its programs. There are 4 main sections of the wasm memory, and they are present in all code compiled with LLVM -> `wasm32`. Also - for more information about the `wasm32` compilation target, read [`<unexistant>`](https://example.com).

> TODO: Make links point to header3s (with horizontal rules) down below

1. The Heap (`#heap`)\
  Stores all dynamically allocated data. Anytime the program calls `malloc()` (or another native dynamic allocation function), the allocation is stored somewhere in this range.
2. **The Stack** (`#stack`)\
  Function's variables are stored in scopes pushed onto the stack. Globals are also at the bottom of the stack.
3. **The Data Section** (`#data`)\
  Stores static data that the wasm uses to execute. For example, static strings are stored here.
4. **The Void** (`#void`)\
  An empty area in the memory.

This following image shows their placement in the memory. The top of the image represents the higher addresses, and the bottom of the image represents address 0.

> ![mem](https://user-images.githubusercontent.com/79597906/137538688-68496a01-6db1-4f3d-baf5-2ffebac56983.png)\
> Sample view of LLVM's `wasm32` memory (not to scale)

> ![memtoscale](https://user-images.githubusercontent.com/79597906/137538880-907983cc-54c0-463c-ad05-a45b5e4fdb55.png)\
> To scale view

## Structures
