# **Incoming Packets**

Also known as clientbound, these packets, after being encoded, are sent from the server to the client. Most of these packets aren't too complex once you understand the basics of a reader, with the exception of the incoming `0x00` packet.

| Header                                              | Name              | Description                                                 |
| --------------------------------------------------- | ----------------- | ----------------------------------------------------------- |
| [`0x00`](./incoming.md#0x00-update-packet)          | Update            | Creates, updates, and deletes objects and entities          |
| [`0x01`](./incoming.md#0x01-outdated-client-packet) | Outdated Client   | Response to invalid build in the init packet                |
| [`0x02`](./incoming.md#0x02-compressed-packet)      | Compressed Packet | LZ4 compressed packet of any header                         |
| [`0x03`](./incoming.md#0x03-notification-packet)    | Notification      | Sends notifications in game                                 |
| [`0x04`](./incoming.md#0x04-server-info-packet)     | Server Info       | Send information about the server, host & region            |
| [`0x05`](./incoming.md#0x05-heartbeat-packet)       | Heartbeat         | Ping pong packet                                            |
| [`0x06`](./incoming.md#0x06-party-link-packet)      | Party Link        | Sends the party link if available                           |
| [`0x07`](./incoming.md#0x07-accept-packet)          | Accept            | Sent after initial handshake, on client acceptance          |
| [`0x08`](./incoming.md#0x08-achievement-packet)     | Achievement       | Updates clientside achievements from the server             |
| [`0x09`](./incoming.md#0x09-invalid-party-packet)   | Invalid Party     | Sent when the party in the init packet is invalid           |
| [`0x0A`](./incoming.md#0x0a-player-count-packet)    | Player Count      | Global count of clients connected                           |
| [`0x0B`](./incoming.md#0x0b-pow-challenge-packet)   | PoW Challenge     | Sends a required proof of work challenge                    |
| [`0x0C`](./incoming.md#0x0c-unnamed-packet)         | Unnamed           | Unnamed, Unused packet                                      |
| [`0x0D`](./incoming.md#0x0d-eval-challenge-packet)  | Eval Challenge    | Sends (obfuscated) js code to be executed. Result is an int |

---

## **`0x00` Update Packet**

---

## **`0x01` Outdated Client Packet**

---

## **`0x02` Compressed Packet**

---

## **`0x03` Notification Packet**

---

## **`0x04` Server Info Packet**

---

## **`0x05` Heartbeat Packet**

Part of the game's latency system. Once receieved, the client immediately echoes the single byte `0x05` packet back. 🏓

Sample Packet (Decoded):

```
incoming <- 05

response:
outgoing -> 05
```

---

## **`0x06` Party Link Packet**

---

## **`0x07` Accept Packet**

Packet sent once the game server has accepted the client. After this packet is sent, updates begin to pour in. As of Feb 25, the server only accepts the client once the client solves a [PoW](./incoming.md#0x0b-pow-challenge-packet) and [Eval](./incoming.md#0x0d-eval-challenge-packet) challenge

Sample Packet (Decoded):

```
incoming <- 07
```

---

## **`0x08` Achievement Packet**

---

## **`0x09` Invalid Party Packet**

---

## **`0x0A` Player Count Packet**

---

## **`0x0B` PoW Challenge Packet**

---

## **`0x0C` Unnamed Packet**

---

## **`0x0D` Eval Challenge Packet**
