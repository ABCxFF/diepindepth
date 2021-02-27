# **Incoming Packets**

Also known as clientbound, these packets, after being encoded, are sent from the server to the client. Most of these packets aren't too complex once you understand the basics of a reader, with the exception of the incoming `0x00` packet.

| Header                                              | Name              | Description                                                  |
| --------------------------------------------------- | ----------------- | ------------------------------------------------------------ |
| [`0x00`](./incoming.md#0x00-update-packet)          | Update            | Creates, updates, and deletes objects and entities           |
| [`0x01`](./incoming.md#0x01-outdated-client-packet) | Outdated Client   | Response to invalid build in the init packet                 |
| [`0x02`](./incoming.md#0x02-compressed-packet)      | Compressed Packet | LZ4 compressed packet of any header                          |
| [`0x03`](./incoming.md#0x03-notification-packet)    | Notification      | Sends notifications in game                                  |
| [`0x04`](./incoming.md#0x04-server-info-packet)     | Server Info       | Send information about the server, host & region             |
| [`0x05`](./incoming.md#0x05-heartbeat-packet)       | Heartbeat         | Ping pong packet                                             |
| [`0x06`](./incoming.md#0x06-party-link-packet)      | Party Link        | Sends the party link if available                            |
| [`0x07`](./incoming.md#0x07-accept-packet)          | Accept            | Sent after initial handshake, on client acceptance           |
| [`0x08`](./incoming.md#0x08-achievement-packet)     | Achievement       | Updates clientside achievements from the server              |
| [`0x09`](./incoming.md#0x09-invalid-party-packet)   | Invalid Party     | Sent when the party in the init packet is invalid            |
| [`0x0A`](./incoming.md#0x0a-player-count-packet)    | Player Count      | Global count of clients connected                            |
| [`0x0B`](./incoming.md#0x0b-pow-challenge-packet)   | PoW Challenge     | Sends a required proof of work challenge                     |
| [`0x0C`](./incoming.md#0x0c-unnamed-packet)         | Unnamed           | Unnamed, Unused packet                                       |
| [`0x0D`](./incoming.md#0x0d-eval-challenge-packet)  | Eval Challenge    | Sends (obfuscated) js code to be evaluated. Result is an int |

---

## **`0x00` Update Packet**

---

## **`0x01` Outdated Client Packet**

Sent when the client's build is not the same as the server's. The server sends the latest build, and when the client receives it, the page reloads. This packet is by naturally unencoded, meaning its data is sent raw unencoded. This is since if you have an invalid build you won't be able to decode packets.


Format: 
> `01 stringNT(new build)`

Example Packet and Response:

```js
incoming <- 01 stringNT(c94fc18cf6171f8d502f5c979488e143f1e5f74f)

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

When an incoming packet is big enough, the server sends you a compressed version of the packet instead. The compression algorithm used is LZ4, it is explained on [Ticki's blog](https://ticki.github.io/blog/how-lz4-works/)

At the start of the packet there is a little-endian u32 specifying the final length of the decompressed packet, so you know the size of the buffer to allocate and can check at the end if there was an error while decompressing (though this should never happen)

Format:
> `02 u32(decompressed output length) (LZ4 blocks)`

The decompressed result will include the packet header, you should feed this into your parsing function recursively. The decompressed result is not [encoded](./encoding.md). Currently only [Update](./incoming.md#0x00-update-packet) and [Eval](./incoming.md#0x0d-eval-challenge-packet) packets can get large enough to be compressed.

---

## **`0x03` Notification Packet**

This packet sends data which trigger the notifications you see in game. For example, messages like "The Guardian has spawned" are considered notifications. 

The red blue green values are encoded as an u32. For example, rgb(33, 130, 67) would be the same as u32(0x43822100) where each byte is a color. The time the notification appears in milliseconds is encoded as a float, and the final value part of this packet is the identifier. If one notification packet shares the same identifier as a previous notification (unless the identifier is empty), then before sending the new notification, it expires the previous, as if its timer was up.

Format:
> `03 stringNT(message) uint32(BGR0) float(time in ms) stringNT(identifier)`

---

It's worth nothing that not all notifications are sent throught this packet. Some notifcations are fully clientside such as the autofire and autospin notifications.

## **`0x04` Server Info Packet**

This tells the client which gamemode is selected, and sets the server region which is displayed next to the ping when holding L.

Format:
> `04 stringNT(gamemode) stringNT(host-region)`

Sample Packet (Decoded):

```
incoming <- 04 stringNT("sandbox") stringNT("vultr-amsterdam")
```

---

## **`0x05` Heartbeat Packet**

Part of the game's latency system. Once receieved, the client immediately echoes the single byte `0x05` packet back. 🏓

Format:
> `05`

Sample Packet and Response (Decoded):

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

Out of all the packets, this one has been researched the least. An array of achievement hash strings which when received, update the localStorage so that you obtain the hash's corresponding achievement. The length of this array is read as a varuint.

Format:
> `08 vu(hash count):array( ...stringNT(achievement hash) )`

---

## **`0x09` Invalid Party Packet**

This single byte packet is sent whenever the party link you sent in the init packet (outgoing) is invalid.

Format:
> `09`

Sample Packet and Response (Decoded):

```js
incoming <- 09

response:
window.alert('Invalid party ID');
```


---

## **`0x0A` Player Count Packet**

This packet is sent occasionally, sending the total client count encoded in a varuint. This updates the text on the bottom right of the screen "*n* players". This packet is not sent globally across all server at the same time, but the exact ticks before a player count update is unknown.

Format:
> `0A vu(client count)`

Sample Packet (Decoded):

```
incoming <- 0A vu(3364)
```

---

## **`0x0B` PoW Challenge Packet**

The packet that initiates the Proof of Work convos that are active throughout the connection. More info on how pow works [here](/protocol/pow.md)

Format:
> `0B vu(difficulty) stringNT(prefix)` 

Something worth noting is that the prefix is always 16 chars long. Here's a sample:

```js
incoming <- 0B vu(20) stringNT("5X6qqhhfkp4v5zf2")

response:
m28.pow.solve("5X6qqhhfkp4v5zf2", 20).then(solveStr => {
  outgoing -> 0A stringNT(solveStr);
});
```

---

## **`0x0C` Unnamed Packet**

This packet has never been observed, and while the packet's format has been reversed, its never used and does not affect the client.

Format:
> `0C vu(unknown)`

---

## **`0x0D` Eval Challenge Packet**

This packet is sent only once, during the client -> server acceptance handshake. It sends highly obfuscated code to be evaluated by the client with the purpose of filtering out headless clients from clients on the web - part of diep.io's anti botting system. The result of this code is always an uint32 and is sent back to the client through the `0x0C` outgoing Eval Result packet.

The code sent is obfuscated with [obfuscator.io](http://obfuscator.io/), almost all setting turned on max. This packet checks for global objects and specific properties on global objects, if all the checks pass their intended result, the code ends up returning the correct uint32 result, which the game server recognises and continues (or completes) the process of accepting the client. 

> Fun fact:  
> -  There are only 200 unique obfuscated evaluation codes that can be sent to the client, and they are constant throughout rebuilds.

Format:
> `0D vu(id) stringNT(code)`

Sample Packet and Response:
```js
incoming <- 0D vu(0) stringNT(too long code)

	
try {
  var f = new Function(UTF8ToString(code));
  f()(function(v) {
    _game_js_challenge_response(id, v)
  })
} catch (e) {
  console.error(e);
  _game_js_challenge_response(id, 0)
}

outgoing -> 0B vu(0) u32(result)
```
