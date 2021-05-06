# 0x00 Incoming Packet

The infamous one and only 0x00 update packet, containing almost all information you see in the game. If you have not read [`/entities.md`](/entities.md), I do highly advise reading it, as it relates directly to how update packets work.

The update packet contains server uptick, entity deletions (entities on screen that should be deleted), and entity upcreates (creations new entities or updates of older entities). The rough format of the 0x00 packet is as follows:
> `0x00 vu(deleteCount) ...entity id deletes vu(upcreateCount) ...upcreations
