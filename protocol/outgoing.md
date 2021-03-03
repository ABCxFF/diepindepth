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

---

## **`0x01` Input Packet**

---

## **`0x02` Spawn Packet**

---

## **`0x03` Stat Upgrade Packet**

---

## **`0x04` Tank Upgrade Packet**

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

---

## **`0x09` Take Tank Packet**

---

## **`0x0A` PoW Solve Packet**

---

## **`0x0B` JS Result Packet**

