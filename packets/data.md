# **Data**

## **Encoding Types**

| Name         | Description                | Size | Alias    |
| ------------ | -------------------------- | ---- | -------- |
| `u8`         | An unsigned 8 bit integer  | 1    | `u8`     |
| `varint32`   | A signed 32 bit integer    | 1-4  | `vi`     |
| `varuint32`  | An unsigned 32 bit integer | 1-4  | `vu`     |
| `varfloat32` | A float casted to a varint | 1-4  | `vf`     |
| `float`      | A floating point number    | 4    | `f32`    |
| `int32`      | A little-endian integer    | 4    | `i32`    |
| `stringNT`   | A null terminated string   | 1+   | `string` |

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

A varint encoded tank id, defaults to -1. Tanks are listed [here](./TANKS)

---

### **`flags`** - `vu`

A varuint encoded series of bit flags with varying value. Example would be the outgoing input packet:

```
00000001 ; u8 ; header
10011001 00010000 ; vu ; flags
10001000 10000001 10000101 00000010 ; vf ; mouse x
10001010 10100111 10000001 00001111 ; vf ; mouse y
```

In this scenario, flags would be read as a varuint, which results in 2073. This can be expressed in binary as `100000011001`, and would be parsed as a flag like the following:

```
1 ; x800 ; constant of true ; (on always)
0 ; x400 ; switch class     ; (off)
0 ; x200 ; use gamepad      ; (off)
0 ; x100 ; instant upgrade  ; (off)
0 ; x080 ; right mouse      ; (off)
0 ; x040 ; suicide key      ; (off)
0 ; x020 ; god mode toggle  ; (off)
1 ; x010 ; right key        ; (on)
1 ; x008 ; down key         ; (on)
0 ; x004 ; left key         ; (off)
0 ; x002 ; up key           ; (off)
1 ; x001 ; left mouse       ; (on)
```

---

### **`entid`** - `<vu: hash, vu: id>`

A way of storing hash and id used in the <id, hash> system. Sent from Zeach (besides comments), the server's entid encoder:

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

**Quick Misconception,** in diep's console, sometimes you'll see messages relating to _"possible desyncs"_ and alongside them you'll see two numbers inside of these `<triangular bracket things>`, these are NOT `<hash, id>`. Unlike the order they are read, entids are logged as `<id, hash>` - the full reason for this, and the meaning behind hashes is still unknown.

### **Data Organization**

In packets, mainly the 0x00
