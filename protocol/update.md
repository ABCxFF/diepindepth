# 0x00 Update Packet
---
The infamous one and only 0x00 update packet, containing almost all information you see in the game. If you have not read [`/entities.md`](/entities.md), I do highly advise reading it, as it relates directly to how update packets work.

The update packet contains server uptick, entity deletions (entities on screen that should be deleted), and entity upcreates (creations new entities or updates of older entities). The rough format of the 0x00 packet is as follows:
> `0x00 vu(deleteCount) ...entity id deletes vu(upcreateCount) ...upcreates`

Two types of things can happen in an upcreate, there can be a creation, and an update (hence the word upcreate). Creations and updates have their own format and are identified in their own way. Both of the data in creations updates though, are organized in a field order, which is the per-build order of all fields.
> Being 68 fields, there are always 68 indexes. These field indexes are used for the protocol, and for the offsets in the memory. All fields and located here
Read a bit more about field orders [here](/entities.md#fields)
---
### 1. How to identify between Creation and Update

The following are examples of some basic upcreates:

**Creation**
> ```less
> 01 08 # entity id
>    01 # signify creation, and read field groups
>    05 01 # field group table
>    93 02 93 45 28 # data
> ```
**Update**
> ```less
> 01 03 # entity id
>    00 01 # signifies update
>    05 93 02 00 45 # field data
>    01 # close field
> ```
So in updates, after the entity id is a `00` byte, and in creation, its a `01` which initiates the [jump table](/protocol/data.md#data-organization).

### 2. Parsing Creation

### 3. Parsing Update
