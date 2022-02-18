# 0x00 Update Packet
---
The one and only infamous 0x00 update packet contains almost all the information you see in the game. If you have not yet read [`/entities.md`](/entities.md), I highly advise you to read it, because it directly relates to how update packets work.

The update packet contains server uptick, entity deletions (entities on screen that should be deleted), and entity upcreates (creations of new entities or updates of older entities). The rough format of the 0x00 packet is as follows:
> `0x00 vu(game tick) vu(deleteCount) ...entity id deletes vu(upcreateCount) ...upcreates`

Two types of things can happen in an upcreate, there can be creations and / or updates (hence the word upcreate). Creations and updates have different formats and are identified in their own way. Both of the data in creations and updates are organized in a field order, which is the per-build order of all fields.
> Being 68 fields, there are always 68 indexes. These field indexes are used in the protocol and to determine the field offsets in the memory. All fields and located here
Read a bit more about field orders [here](/entities.md#fields)
---
### 1. How to identify between Creation and Update

The following are examples of some basic upcreates:

**Creation**
> ```less
> 01 08 # entity id
>    01 # signifies creations
>    05 01 # field group table
>    93 02 93 45 28 # data
> ```
**Update**
> ```less
> 01 03 # entity id
>    00 # signifies updates
>    01 # field group table
>    05 93 02 00 45 # field data
>    01 # close field
> ```
So in updates, after the entity id are bytes `00 01`, and in creations, it's just `01` which initiates the [jump table](/protocol/data.md#data-organization).

### 2. Parsing Creation

> This is not up to date, will be fixed soon

As stated in [`entities.md`](/entities.md), entities are defined by their entity id, entity hash, field groups, and field data, all of which are present in creations. The entity id and hash are encoded in the [entid format](/protocol/data.md#entid---vu-hash-vu-id), the field groups are encoded in a [jump table](/protocol/data.md#data-organization), then fields are retrieved from the field groups, ordered by the shuffled field order, then the data type that corresponds with each field in order is read from the packet. Here's a rough sketch of what it would look like:

> ```less
> 01 03 # entity id
>    01 # signifies creation
>       00 # field groups, read as a jump table with no values only indexes
>       02
>       00
>       02
>    01 # close table
>    
>    ...byte /*
>     *n* number of bytes that have all entity's data
>     the fields are identified from the field groups and are reordered in the way field IDs were shuffled for the current build
>     the bytes are then read in order & types of these organized fields
>     
>     */
> ```

Note:
- To parse tabled fields, such as `leaderboardNames`, you need to know the total amount of values they have. `leaderboardNames` for example has `10`, so you would read 10 null terminating strings which are its data type.

Abstract Format of a Creation:

> `entid(entity id, hash) 0x01 jumpTable(fieldGroup indexes only) ...field data`

### 3. Parsing Update

