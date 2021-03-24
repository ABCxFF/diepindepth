# Entities

This document will provide a perspective on how the entire game's networking and entity management system works as whole.

From a developer standpoint, you can think of an entity as an object, it has properties that are stored / sent to the client. Entities are identified by a (not fully understood) <id, hash> system. In this system there is a unique identifier `id` is given to every entity, and while that `id` is being used, no other entity may share it. There is also a hash that is sent, the purpose of this is not known, and few discoveries ahve been made on it.

The following code was sent by Zeach in a screenshot during a conversation regarding the <id, hash> system. It shows how entity ids are encoded before being sent to the client. More information on entity id encodings can be found [here](/protocol/data.md#entid---vu-hash-vu-id)

```c++
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

---

## Fields

> Discussing what fields are and how they are organized which leads into

---

## Field Groups + Purpose

> Discuss how the game organizes entities by field group, and list all 15.

---

## Parsing

> Discuss basics of how entity's data is sent to the client / parsed by the client.

---

## Memory

> Discuss basics how entities look / interact in the memory


