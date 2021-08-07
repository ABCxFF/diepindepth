# **Data**

## **Encoding Types**

| Name         | Description                                                                              | Size | Alias    |
| ------------ | ---------------------------------------------------------------------------------------- | ---- | -------- |
| `uint8`      | An unsigned 8 bit integer                                                                | 1    | `u8`     |
| `varuint32`  | An unsigned variable-length integer using [LEB128](https://en.wikipedia.org/wiki/LEB128) | 1-4  | `vu`     |
| `varint32`   | A signed variable-length integer                                                         | 1-4  | `vi`     |
| `varfloat32` | A float32 casted to a varint                                                             | 1-4  | `vf`     |
| `float32`    | A little-endian floating point number                                                    | 4    | `f32`    |
| `uint32`     | A little-endian 32 bit integer                                                           | 4    | `u32`    |
| `stringNT`   | A null terminated string                                                                 | 1+   | `string` |

### **Special Types**

---

### **`color`** - `vu`

A varuint encoded `netcolor` id. Sent from Zeach (besides comments) himself, the color list:

```c++
/*
    18 Net Colors
    Once >= 18, the game rejects drawing the color
*/

enum class ID {
  Border,
  Cannon,
  Tank,
  TeamBlue,
  TeamRed,
  TeamPurple,
  TeamGreen,
  Shiny,
  EnemySquare,
  EnemyTriangle,
  EnemyPentagon,
  EnemyCrasher,
  Neutral,
  ScoreboardBar,
  Box,
  EnemyTank,
  NecromancerSquare,
  Fallen,

  kMaxColors
}
```

---

### **`tank`** - `vi`

A varint encoded tank id, defaults to -1. Tanks are listed [here](/extras/tanks.js), and their in-depth definitions [here](/extras/tankdefs.json)

---

### **`bitflags`** - `vu`

A varuint encoded series of bit flags with varying values. An example would be the outgoing input packet:

```
00000001 ; u8 ; header
10011001 00010000 ; vu ; flags
10001000 10000001 10000101 00000010 ; vf ; mouse x
10001010 10100111 10000001 00001111 ; vf ; mouse y
```

The flags are read as a varuint, which for this example results in 2073. This can be expressed in binary as `00000011001`, and each bit gets parsed as a boolean flag starting from the lowest bit to the highest bit like the following:

```
1 ; left mouse       ; (on)
0 ; up key           ; (off)
0 ; left key         ; (off)
1 ; down key         ; (on)
1 ; right key        ; (on)
0 ; god mode toggle  ; (off)
0 ; suicide key      ; (off)
0 ; right mouse      ; (off)
0 ; instant upgrade  ; (off)
0 ; use gamepad      ; (off)
0 ; switch class     ; (off)
```

---

### **`entid`** - `<vu: hash, vu: id>`

A way of storing hash and id is used in the <id, hash> system. Sent from Zeach (besides comments), the server's entid encoder:

```c++
/*
    In the Reader's perspective, this means:
      - Hash is read as a varuint32 (aka vu)
      - When hash is 0, stop reading
      - If hash is not 0, read the id as well

      Read Result:
      {hash} or {hash, id}
*/
inline void Encode(BinData &out) const {
  if(hash == 0){
    out.PushVarUint32(0);
  } else {
    out.PushVarUint32(hash);
    out.PushVarUint32(id);
  }
  DEBUG_EntityManager("Encoded handle %d %d", int(id), int(hash));
}
```

The id: A universal identifier that is unique while the entity is alive, but once the entity is destroyed - the id may be used by another entity in the future. **IDs are unique, but can be recycled**
The hash: This seems to be the total amount of times a specific id has been used/recycled.

**Quick Misconception,** in Diep's console, sometimes you'll see messages relating to _"possible desyncs"_ and alongside them, you'll see two numbers inside of these `<triangular bracket things>`, these are NOT `<hash, id>`. Unlike the order they are read, entids are logged as `<id, hash>` in the Diep console.

---

### **Data Organization**

Inside of 0x00 packets, there is data stored in a table-like form of data, which has come to be known as a "jump table". Jump tables work differently than standard arrays. They are parsed by retrieving indexes from jumps, then parsing values based on that index. The best way to explain the format is with an example, here is an example of a field group identification jump table, in this case, indexes without any values.

```

initial index = -1

01    ; u8 ; Jump Table Start (not always present)
   00 ; vu ; xored jump = 0x00     = 0
      ; true jump = xored jump ^ 1 = 1
      ; index += true jump =-1 + 1 = 0
no value being read

   02 ; vu ; xored jump = 0x02     = 2
      ; true jump = xored jump ^ 1 = 3
      ; index += true jump = 0 + 3 = 3
no value being read

   00 ; vu ; xored jump = 0x00     = 0
      ; true jump = xored jump ^ 1 = 1
      ; index += true jump = 3 + 1 = 4
no value being read

   05 ; vu ; xored jump = 0x05     = 5
      ; true jump = xored jump ^ 1 = 4
      ; index += true jump = 4 + 4 = 8
no value being read

   03 ; vu ; xored jump = 0x03     = 3
      ; true jump = xored jump ^ 1 = 2
      ; index += true jump = 8 + 2 = 10
no value being read

   00 ; vu ; xored jump = 0x00     = 0
      ; true jump = xored jump ^ 1 = 1
      ; index +=true jump = 10 + 1 = 11
no value being read

   03 ; vu ; xored jump = 0x03     = 3
      ; true jump = xored jump ^ 1 = 2
      ; index +=true jump = 11 + 2 = 13
no value being read

01    ; u8 ; Jump Table End
```

The resulting indexes from this jump table were [0, 3, 4, 5, 8, 10, 11, 13]. More about what these values mean in [`incoming.md`](/protocol/incoming.md)

And for more understanding, here are two jump table readers written in Javascript and C++

```c++
template<typename function>
auto jumpTable(function read) {

    std::vector<std::any> table;
    int index = -1; // Starting Index
    int currentJump = 0;

    while(1) {
        currentJump = this->vu() ^ 1; // Read vu() and XOR 1 to retrieve the jump

        if(currentJump == 0) break; // If there is no jump, exit

        index += currentJump; // Jump to the next index
        table.push_back(read(index)); // Read according to index
    }
    return table;
}
```

and in javascript

```js
jumpTable(read) {
    const table = [];
    let index = -1; // Starting Index
    let currentJump = 0;

    while (true) {
        currentJump = this.vu() ^ 1; // Read vu() and XOR 1 to retrieve the jump

        if (!currentJump) break; // If there is no jump, exit

        index += currentJump; // Jump to the next index
        table[table.length++] = read.call(this, index); // Read according to index
    }

    return table;
}
```

Understanding this data structure takes practice, at first it may be difficult to understand, but over time it will be easily understandable and identifiable.
