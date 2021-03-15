# **Outgoing Packets**

Also known as serverbound, these packets, after being encoded, are sent from the client to the server. These packets aren't at all complex, only with the exception of the outgoing `0x01` packet which is the most complex of the outgoing packets (but not too complex).

| Header                                              | Name            | Description                                                        |
| --------------------------------------------------- | --------------- | ------------------------------------------------------------------ |
| [`0x00`](./outgoing.md#0x00-init-packet)            | Init            | Initiates the connection between the client and server. First sent |
| [`0x01`](./outgoing.md#0x01-input-packet)           | Input           | Sends client inputs including movement and mouse                   |
| [`0x02`](./outgoing.md#0x02-spawn-packet)           | Spawn Packet    | Sent when the client wants to spawn, contains chosen name          |
| [`0x03`](./outgoing.md#0x03-stat-upgrade-packet)    | Stat Upgrade    | Upgrades the player's stats                                        |
| [`0x04`](./outgoing.md#0x04-tank-upgrade-packet)    | Tank Upgrade    | Upgrades the player's tank                                         |
| [`0x05`](./outgoing.md#0x05-heartbeat-packet)       | Heartbeat       | Ping pong packet                                                   |
| [`0x06`](./outgoing.md#0x06-tcp-init-packet)        | TCP Init        | Lets the server "acknowledge" tcp connections. Unknown             |
| [`0x07`](./outgoing.md#0x07-extension-found-packet) | Extension Found | Sent when the client detects any modifications made to the game    |
| [`0x08`](./outgoing.md#0x08-to-respawn-packet)      | To Respawn      | Sent when the client leaves the death screen, and moves to respawn |
| [`0x09`](./outgoing.md#0x09-take-tank-packet)       | Take Tank       | Sent when the client wants to control another tank (Dom for ex)    |
| [`0x0A`](./outgoing.md#0x0a-pow-solve-packet)       | PoW Solve       | Sends the solved value for the proof of work challenge             |
| [`0x0B`](./outgoing.md#0x0b-js-result-packet)       | JS Result       | Sends the result of the js challenge sent by the server            |

---

## **`0x00` Init Packet**

The first packet, and the only unencoded one. This packet is sent to initiate the connection, and it gives information like build, admin password, party link, and some other "debug values."

Format:
> `00 string(build hash) string(dev password) string(party code) vu(debug val)`

The dev confirmed that this format is correct, but did not give any information on the varuint at the end of the packet, only that it was only active during "debug builds". If the build sent by the client is the not the same as the one the server is expecting, the server responds with a 0x01 Invalid Build packet.

---

## **`0x01` Input Packet**

---

## **`0x02` Spawn Packet**

This packet creates a spawn attempt, we call it an attempt / request and not a spawn since before you spawn, the server sends you a Proof Of Work challenge for you to solve, to prevent botters from being able to spawn too many bots, though this bot prevention has been easily bypassed, which may or may not be explained in the future.

Format:
> `02 stringNT(name)`

---

The next 2 packets use a shuffler that is derived from the following function:

```js
function magicNum(build) {
  for (var i = 0, seed = 1, res = 0, timer = 0; i < 40; i++) {
   let nibble = parseInt(build[i], 16)
   res ^= ((nibble << ((seed & 1) << 2)) << (timer << 3));
   timer = (timer + 1) & 3;
   seed ^= !timer;
  };

  return res >>> 0; // unsigned
}

// Where the magic shuffler is
magicNum(latest build)
```

---

## **`0x03` Stat Upgrade Packet**

This packet requests to upgrade one of the tank's stats. If you don't have an adequate amount of levels for the next stat, nothing happens. The second varint in the packet identifies the max upgrade level of that stat, so that if the stat is already at or past that varint encoded maximum, nothing will upgrade. Here's a quick example

```js
Current Stats: 1/1/1/1/1/1/1

outgoing -> 03 vi(2 ^ stat xor) vi(-1)
Current Stats: 1/1/1/1/2/1/1

outgoing -> 03 vi(4 ^ stat xor) vi(0)
Current Stats: 1/1/1/1/2/1/1 // nothing happens since 4th stat is already >= 0
```

Format:
> `03 vi(stat index ^ stat xor) vi(max)`

Where stat xor is (using the function up above):

```js
magicNum(latest build) % STAT_COUNT; // STAT_COUNT is 8
```

---

## **`0x04` Tank Upgrade Packet**

This packet is sent to upgrade to a tank. Althought it takes the tank id as a parameter in the packet, if the tank selected is not in your upgrade path, or you don't have enough levels to reach it, nothing will happen. The tank id is xored by a remainder of the magicNum, very similar to the `0x03` outgoing packet. This was, like the stat upgrading packet, in an attempt to prevent scripting or automatic upgrading of tanks.

Format:
> `04 vi(tank id ^ tank xor)`

Where tank xor is (using the function up above):

```js
magicNum(latest build) % TANK_COUNT; // TANK_COUNT is 54
```

---

## **`0x05` Heartbeat Packet**

Part of the game's latency system. Once sent, the server immediately echoes the single byte `0x05` packet back. 🏓

Format:
> `05`

Sample Packet and Response (Decoded):

```
outgoing -> 05

response:
incoming -> 05
```

---

## **`0x06` TCP Init Packet**

This packet has never been observed and has only been seen in server code images sent by M28. The following code is the only information we have on it:
```c++
    }else if(cmd == 0x06){ // Aknowledged ES packet
#ifndef USE_TPC_ES
        if(m_pGame != nullptr){
            m_pGame->Simulation()->Entities()->Acknowledged(ID(), view.NextUint32());
        }
#endif
    ... code after unknown
```

He also talks about it being related to the Mobile version of the game, and is involved in a tpc connection used on mobile.


Format:
> `06 u32(unknown) ...unknown`


---

## **`0x07` Extension Found Packet**



---

## **`0x08` To Respawn Packet**

This peculiar single byte packet is sent whenever you move past the death screen and to the respawn screen. The use of this is so that the server can redirect you to new arenas if the arena you were in was closed. An example of this would be if you die while / after an arena is closing in dom, after you move to the respawn screen you will be redirected to the new arena.

Format:
> `08`

---

## **`0x09` Take Tank Packet**

---

## **`0x0A` PoW Solve Packet**

---

## **`0x0B` JS Result Packet**

