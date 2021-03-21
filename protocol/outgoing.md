# **Outgoing Packets**

Also known as serverbound, these packets, after being encoded, are sent from the client to the server. These packets aren't at all complex, only with the exception of the outgoing `0x01` packet which is the most complex of the outgoing packets (but not too complex).

For information on data types and encodings, see [`data.md`](./data.md)

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
| [`0x0A`](./outgoing.md#0x0a-pow-answer-packet)      | PoW Answer      | Sends the solved answer for the proof of work challenge             |
| [`0x0B`](./outgoing.md#0x0b-js-result-packet)       | JS Result       | Sends the result of the js challenge sent by the server            |

---

## **`0x00` Init Packet**

The first packet, and the only unencoded one. This packet is sent to initiate the connection, and it gives information like build, admin password, party link, and some other "debug values."

Format:
> `00 string(build hash) string(dev password) string(party code) vu(debug val)`

The dev confirmed that this format is correct, but did not give any information on the varuint at the end of the packet, only that it was only active during "debug builds". If the build sent by the client is the not the same as the one the server is expecting, the server responds with a [`0x01` Outdated Client](./incoming.md#0x01-outdated-client-packet) packet.

---

## **`0x01` Input Packet**

The most frequently sent packet coming from the client, sends movement flags, mouse pos, and other input data. 

```
bit  ; name             ; desc
x001 ; fire             ; Set when left mouse / spacebar is down or autofire is on
x002 ; up key           ; Set when up key is down
x004 ; left key         ; Set when left key is down
x008 ; down key         ; Set when down key is down
x010 ; right key        ; Set when right key is down
x020 ; god mode toggle  ; Set when god mode is toggled
x040 ; suicide key      ; Set when suicide key is down
x080 ; right mouse      ; Set when shift / right click is down
x100 ; instant upgrade  ; Set when upgrade key is down
x200 ; use gamepad      ; Set when gamepad is being used instead of keyboard
x400 ; switch class     ; Set when switch class key is toggled
x800 ; unknown          ; Always set
```

For information on how these are encoded, see [`data.md`](./data.md#bitflags---vu) where the example is actually a sample input packet. If the gamepad flag is set, then two additional varfloats are appended to the packet, representing the gamepad's x axis movement and the gamepad's y axis movement.

Format:
> `01 flags(input flags) vf(world mouse x) vf(world mouse y) gamepad?[vf(gamepad x axis) vf(gamepad y axis)]`

---

## **`0x02` Spawn Packet**

This packet creates a spawn attempt, we call it an attempt / request because the server waits for you to solve a [Proof Of Work challenge](./incoming.md#0x0b-pow-challenge-packet) first before spawning you in. If you are waiting to be spawned in (due to PoW or game starting countdown / players needed), sending another one will change the name you will spawn in with.

Format:
> `02 stringNT(name)`

---

## **Magic Tank and Stat XOR**

The next 2 packets use a shuffler that is derived from the following function:

```js
function magicNum(build) {
  for (var i = 0, seed = 1, res = 0, timer = 0; i < 40; i++) {
   let nibble = parseInt(build[i], 16);
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

This packet is sent to upgrade to a tank. Althought it takes the tank id as a parameter in the packet, if the tank selected is not in your upgrade path, or you don't have enough levels to reach it, nothing will happen. The [tank id](../extras/tanks.js) is xored by a remainder of the magicNum, very similar to the `0x03` outgoing packet. This was, like the stat upgrading packet, in an attempt to prevent scripting or automatic upgrading of tanks.

Format:
> `04 vi(tank id ^ tank xor)`

Where tank xor is (using the function up above):

```js
magicNum(latest build) % TANK_COUNT; // TANK_COUNT is 54
```

---

## **`0x05` Heartbeat Packet**

Part of the game's latency system. Once sent, the server immediately echoes the single byte [`0x05`](./incoming.md#0x05-heartbeat-packet) packet back. 🏓

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

This peculiar single byte packet is sent whenever you move past the death screen into the respawn screen. The use of this is so that if the arena is closed the server can redirect you to a new arena or disconnect you to cause the client to connect to another server. An example of this would be after an arena is closing in dom, when you move to the respawn screen you will be redirected to the next game.

Format:
> `08`

---

## **`0x09` Take Tank Packet**

This packet is for requesting to control a tank, like a dominator. It can be sent in any gamemode, but if there is no available tank to take then a [notification](./incoming.md#0x03-notification-packet) with the text *"Someone has already taken that tank"* is sent.

Format:
> `09`

---

## **`0x0A` PoW Answer Packet**

This packet is the response to the [`0x0B` PoW Challenge](./incoming.md#0x0b-pow-challenge-packet) packet - after solving the proof of work challenge, the answer is sent.

Format:
> `0A stringNT(answer)`

---

## **`0x0B` JS Result Packet**

This packet is the evaluated result of the [`0x0D` Int JS Challenge](./incoming.md#0x0d-int-js-challenge-packet) packet. It sends the evaluation id and the result. In older builds, this packet could also be a response to `0x0C` JS String Challenge, which is now no longer fully existing; so this packet is able to encode any type result, meaning that it could send a string or integer.

Format:
> `0B vu(id) any/vu(result)`
