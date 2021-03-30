# Entities

This document will provide a perspective/overview on how the entire game's networking and entity management system works as a whole.

From a developer standpoint, you can think of an entity as an object, it has properties that are stored / sent to the client. Entities are identified by a (not fully understood) <id, hash> system. In this system there is a unique identifier `id` is given to every entity, and while that `id` is being used, no other entity may share it. There is also a hash that is sent, the purpose of this is not known, and few discoveries have been made on it.

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

Fields, like stated earlier, are basically the equivalent of how properties are to objects, but for entities. Fields are used to describe all things in the game, for example the Arena entity has leaderX and leaderY fields, while also having fields that related to other things like sides. Fields can also have multi length values, like scoreboardNames, which is an array of scoreboard names (encoded as an xor jump table); also another property on the arena entity. For each build, all the fields are randomly shuffled (this is done in the builder) so that there is a randomly(?) selected index for each field; Being 68 fields, there are always 68 indexes. These field indexes are used for the protocol, and for the offsets in the memory. All fields and located [here](about:blank)

---

## Field Groups + Purpose

These fields are all organized into groups, field groups. For each field there is a constant (throughout builds) id per field group. So for example, the field `maxHealth` is in the Health field group, and its field-group specific id is 2 across all updates.

> Discuss how the game organizes entities by field group, and list all

---

## Parsing

> Discuss basics of how entity's data is sent to the client / parsed by the client.

---

## Memory

> Discuss basics how entities look / interact in the memory


