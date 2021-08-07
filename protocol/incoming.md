# **Incoming Packets**

Also known as clientbound, these packets, after being encoded, are sent from the server to the client. Most of these packets aren't too complex once you understand the basics of a reader, with the exception of the incoming [`0x00`](#0x00-update-packet) packet.

For information on data types and encodings, see [`data.md`](/protocol/data.md)

| Header                                  | Name              | Description                                                  |
| --------------------------------------- | ----------------- | ------------------------------------------------------------ |
| [`0x00`](#0x00-update-packet)           | Update            | Creates, updates, and deletes objects and entities           |
| [`0x01`](#0x01-outdated-client-packet)  | Outdated Client   | Response to invalid build in the init packet                 |
| [`0x02`](#0x02-compressed-packet)       | Compressed Packet | LZ4 compressed packet of any header                          |
| [`0x03`](#0x03-notification-packet)     | Notification      | Sends notifications in game                                  |
| [`0x04`](#0x04-server-info-packet)      | Server Info       | Send information about the server, host & region             |
| [`0x05`](#0x05-heartbeat-packet)        | Heartbeat         | Ping pong packet                                             |
| [`0x06`](#0x06-party-code-packet)       | Party Code        | Sends the party code if available                            |
| [`0x07`](#0x07-accept-packet)           | Accept            | Sent after initial handshake, on client acceptance           |
| [`0x08`](#0x08-achievement-packet)      | Achievement       | Updates clientside achievements from the server              |
| [`0x09`](#0x09-invalid-party-packet)    | Invalid Party     | Sent when the party in the init packet is invalid            |
| [`0x0A`](#0x0a-player-count-packet)     | Player Count      | Global count of clients connected                            |
| [`0x0B`](#0x0b-pow-challenge-packet)    | PoW Challenge     | Sends a required proof of work challenge                     |
| [`0x0C`](#0x0c-unnamed-packet)          | Unnamed           | Unnamed, Unused packet                                       |
| [`0x0D`](#0x0d-int-js-challenge-packet) | Int JS Challenge  | Sends (obfuscated) js code to be evaluated. Result is an int |

---

## **`0x00` Update Packet**

Contains created/updated/deleted entities and current ingame time. There is too much to explain here, it'd be easier just putting it in [`update.md`](/protocol/update.md).

---

## **`0x01` Outdated Client Packet**

Sent when the client's build (which is sent in the [`0x00` Init Packet](/protocol/outgoing.md#0x00-init-packet)) is not the same as the server's. The server sends the latest build, and when the client receives it, the page reloads. This packet is by nature unencoded, meaning its data is sent raw, unencoded. This is since if you have an invalid build you won't be able to decode packets properly.


Format: 
> `01 stringNT(new build)`

Sample Packet and Response:

```js
incoming <- 01 stringNT("c94fc18cf6171f8d502f5c979488e143f1e5f74f")

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

At the start of the packet there is a u32 specifying the final length of the decompressed packet, so you know the size of the buffer to allocate and can check at the end if there was an error while decompressing (though this should never happen)

Format:
> `02 u32(decompressed output length) (LZ4 block)`

The decompressed result will include the packet header, you should feed this into your parsing function recursively. The decompressed result is not [encoded](/protocol/crypto.md). Currently only [Update](#0x00-update-packet) and [JS Challenge](#0x0d-int-js-challenge-packet) packets can get large enough to be compressed.

---

## **`0x03` Notification Packet**

This packet sends data that trigger the notifications you see in-game, for example, messages like "The Guardian has spawned" and "You've killed Example". 

The Red Green Blue values are encoded as a u32. For example, rgb(33, 130, 67) would be the same as u32(0x218243) where each byte is a color. The fourth byte is not used, there is no alpha channel. The time the notification appears in milliseconds is encoded as a float, and the final value part of this packet is the notification identifier.  

If a notification with the same identifier as the new one already exists (unless the identifier is an empty string) then the previous notification disappears immediately without waiting for its timer, only one notification may exist at a time with a given identifier. This is used to make sure duplicate notifications such as toggles do not spam your screen. The identifiers used in the game are the following, though note that there are many more types of notifications without one:

- `autofire`
- `autospin`
- `godmode_toggle`
- `gamepad_enabled`
- `adblock`
- [`cant_claim_info`](/protocol/outgoing.md#0x09-take-tank-packet)

Format:
> `03 stringNT(message) u32(RGB) float(duration) stringNT(identifier)`

---

It's worth noting that not all notifications are sent through this packet. The autofire, autospin, gamepad_enabled, and adblock notifications are fully clientside while the rest are received from the server.

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

Part of the game's latency system. Once received, the client immediately echoes the single-byte [`0x05` packet](/protocol/outgoing.md#0x05-heartbeat-packet) back. 🏓

Format:
> `05`

Sample Packet and Response (Decoded):

```
incoming <- 05

response:
outgoing -> 05
```

---

## **`0x06` Party Code Packet**

This packet is only sent in the 2 Teams, 4 Teams, Domination and Sandbox gamemodes. When this packet is sent the `Copy party link` button appears, otherwise the button is not shown. It contains the un-swapped party code for the arena and team you are in.

Format:
> `06 ...bytes(party code)`

Sample Packet and Response (Decoded):

```
incoming <- 06 2D CD 03 54 C3

response: show the Copy party link button
```

### Building a party link

1. Write the M28 server ID (`brlm` in this example) as a stringNT and append the party code:
   > stringNT("brlm") bytes(0x2D 0xCD 0x03 0x54 0xC3)
   > 
   > 62 72 6C 6D 00 2D CD 03 54 C3

2. Swap the nibbles in every byte:
   > 26 27 C6 D6 00 D2 DC 30 45 3C

The final link is `diep.io/#2627C6D600D2DC30453C`

---

## **`0x07` Accept Packet**

This packet is sent once the game server has accepted the client (correct build, valid or no party). As of Feb 25, the server only accepts the client once the client solves a [JS Challange](#0x0d-int-js-challenge-packet) and [PoW](#0x0b-pow-challenge-packet) challenge.

Format:
> `07`

---

## **`0x08` Achievement Packet**

Out of all the packets, this one has been researched the least. An array of achievement hash strings which when received, update the localStorage so that you obtain the hash's corresponding achievement. The length of this array is read as a varuint.

Format:
> `08 vu(hash count):array( ...stringNT(achievement hash) )`

Sample Packet (Decoded):

```
incoming <- 08 vu(6) stringNT("9898db9ff6d3c1b3_1") stringNT("300ddd6f1fb3d69d_1") stringNT("8221180ec6d53232_1") stringNT("33e4cb47afd5602f_1") stringNT("6d671cfa6dceb09_1") stringNT("256245339c3742d2_1")
```

---

## **`0x09` Invalid Party Packet**

This single byte packet is sent if the party code you specified in the [Init Packet](/protocol/outgoing.md#0x00-init-packet) is invalid. You will get this instead of the [`0x07`](#0x07-accept-packet) packet, only after solving a [JS Challange](#0x0d-int-js-challenge-packet) and [PoW](#0x0b-pow-challenge-packet) challenge.

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

This packet is sent occasionally, sending the total client count encoded in a varuint. This updates the text on the bottom right of the screen "*n* players". This packet is not sent globally across all servers at the same time, and the exact ticks before a player count update are unknown.

Format:
> `0A vu(client count)`

Sample Packet (Decoded):

```
incoming <- 0A vu(3364)
```

---

## **`0x0B` PoW Challenge Packet**

The packet that initiates the Proof of Work convos that are active throughout the connection. Response is an outgoing [`0x0A` PoW Answer Packet](/protocol/outgoing.md#0x0a-pow-answer-packet). More info on how PoW works [here](/protocol/pow.md)

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

This packet has never been observed, and while the packet's format has been reversed, it's never used and does not affect the client. On an older version this was the same as the [`0x0D` Int JS Challenge](#0x0d-int-js-challenge-packet) packet, except it expected a string as a response. So we can't be sure if this packet is still the same as it was and is just not fully present due to [Emscripten](https://github.com/emscripten-core/emscripten) simplifications, or if it changed completely.

Format:
> `0C vu(unknown)`

---

## **`0x0D` Int JS Challenge Packet**

This packet is sent only once, during the client -> server acceptance handshake. It sends highly obfuscated code to be evaluated by the client with the purpose of filtering out headless clients from clients on the web - part of diep.io's anti botting system. The result of this code is always an uint32 and is sent back to the client through the outgoing [`0x0B` JS Result](/protocol/outgoing.md#0x0b-js-result-packet) packet.

The code sent is obfuscated with [obfuscator.io](https://obfuscator.io/), almost all settings turned on max. This packet checks for global objects and specific properties on global objects, if all the checks pass their intended result, the code ends up returning the correct uint32 result, which the game server recognizes and continues (or completes) the process of accepting the client. 

> Fun fact:
> -  There are only 200 unique obfuscated evaluation codes that can be sent to the client, and they are reused across all servers and are generated during the building process (per update).

Format:
> `0D vu(id) stringNT(code)`

Sample Packet and Response (Decoded):
```js
incoming <- 0D vu(0) stringNT(too long code)

response:
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

Here's [wonderful explanation by Shädam](https://github.com/supahero1/diep.io/tree/master/eval_packet) of deobfuscation which has information on code flow and deobfuscation of the eval packet's code.
