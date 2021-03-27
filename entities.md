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

> Disclaimer: The names and labels (except the entity <id, hash> system) we came up for entity related stuff are not from the game, so if you understand these concepts easier with another name, by all means, use a name that helps you understand this stuff

---

## Fields

Fields, like stated earlier, are basically the equivalent of how properties are to objects, but for entities. Fields are used to describe all things in the game, for example the Arena entity has leaderX and leaderY fields, while also having fields that related to other things like sides. Fields can also have multi length values, like scoreboardNames, which is an array of scoreboard names (encoded as an xor jump table); also another property on the arena entity.

---

## Field Groups + Purpose

> Discuss how the game organizes entities by field group, and list all 15.

---

## Parsing

> Discuss basics of how entity's data is sent to the client / parsed by the client.

---

## Memory

> Discuss basics how entities look / interact in the memory


