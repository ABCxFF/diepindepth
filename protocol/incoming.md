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

Sent when the client's build is not the same as the server's. The server sends the latest build, and when the client receives it, the page reloads. This packet is by naturally unencoded, meaning its data is sent raw unencoded. This is since if you have an invalid build you won't be able to decode packets.


Format: 
> `01 stringNT(newBuild)`

Example convo:
```js
incoming <- 01 63 39 34 66 63 31 38 63 66 36 31 37 31 66 38 64 35 30 32 66 35 63 39 37 39 34 38 38 65 31 34 33 66 31 65 35 66 37 34 66 00 (c94fc18cf6171f8d502f5c979488e143f1e5f74f)

response: // Reversed from source, see /wasm/ for more information on reversal
function reload(version /* new build, read as a string from the packet */) {
  if (window["setLoadingStatus"]) window["setLoadingStatus"]("Updating...");
    setTimeout(function() {
      window.location.reload(true)
    }, 2e3)
  }
}
reload()
```


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

This packet is sent occasionally, sending the total client count encoded in a varuint. This updates the text on the bottom right of the screen "*n* players". This packet is not sent globally across all server at the same time, but the exact ticks before a player count update is unknown.

Format:
> `0A vu(client count)`

---

## **`0x0B` PoW Challenge Packet**

The packet that initiates the Proof of Work convos that are active throughout the connection. More info on how pow works [here](/protocol/pow.md)

Format:
> `0B vu(difficulty) stringNT(prefix)` 

Something worth noting is that the prefix is always 16 chars long. Here's a sample:

```js
incoming <- 0B vu(20) stringNT("5X6qqhhfkp4v5zf2")

m28.pow.solve(20, "5X6qqhhfkp4v5zf2").then(solveStr => {
  outgoing -> 0A stringNT(solveStr);
})
```

---

## **`0x0C` Unnamed Packet**

This packet has never been observed, and while the packet's format has been reversed, its never used and does not affect the client.

Format:
> `0C vu(unknown)`

---

## **`0x0D` Eval Challenge Packet**
