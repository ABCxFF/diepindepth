# Entities

This document will provide a perspective / overview on how the entire game's networking and entity management system works as a whole.

From a developer standpoint, you can think of an entity as an object, it has properties that are stored/sent to the client. Entities are identified by a (not fully understood) <id, hash> system. In this system, there is a unique identifier for every entity, aka `id`. No two entities alive can share the same `id`. The hash part of the system tracks how many entities a specific `id` has been used for during the arena's uptime. This is for better analysis of desynchronizations.

The following code was sent by Zeach in a screenshot during a conversation regarding the <id, hash> system. It shows how entity ids are encoded before being sent to the client. More information on entity id encodings can be found [here](/protocol/data.md#entid---vu-hash-vu-id).

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

Fields, as stated earlier, are basically the equivalent of how properties are to objects, but for entities. Fields are used to describe all things in the game. For example, the Arena entity has leaderX and leaderY fields, while also having fields that are related to other things like sides. Fields can also have multi-length values, like scoreboardNames, which is an array of scoreboard names (encoded as a xor jump table); also another property on the arena entity. For each build, all the fields are randomly shuffled (this is done in the builder) so that there is a randomly(?) selected index for each field; Being 68 fields, there are always 68 indexes. These field indexes are used in the protocol and to determine the field offsets in the memory. All fields and located [~~here~~ To be done.](about:blank)

---

## Field Groups + Purpose

These fields are all organized into groups, known as field groups. For each field, there is a constant (throughout builds) id per field group. So for example, the field `maxHealth` is in the Health field group, and its field-group specific id is 2 across all updates. You can see the field groups and field ids per field [~~here~~ To be done.](about:blank). Here is the list of field group names by id (empty = deleted / not in code)
```
0 : RELATIONSHIPS
1 : 
2 : BARREL
3 : PHYSICS
4 : HEALTH
5 :
6 : UNKNOWN
7 : ARENA
8 : NAME
9 : GUI
10: POS
11: STYLE
12:
13: SCORE
14: TEAM
15:
```

Field groups are also used for the organization of entities, but that will be explained more in the memory section.

---

## Parsing

Only one packet is used to update entities in-game. The [0x00 Update Packet](/protocol/update.md#0x00-update-packet). Most of what will be said here will be explained more in-depth on that page. 

Entities can only be created, deleted, or updated in the game. In the 0x00 packet format, there are two arrays (`vu32(len), ...elems`). An array of [`entid`](/protocol/data.md#entid---vu-hash-vu-id)s to be deleted from the clients' entity storage, and an array of `upcreates`, which are either updates or creations. Creations contain full data about an entity, whereas updates only update specific fields at a time. More info, as stated earlier, is on the [0x00 Update Packet](/protocol/update.md#0x00-update-packet) page.

---

## Memory

> Discuss the basics of how entities look / interact in the memory.


