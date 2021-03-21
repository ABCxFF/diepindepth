> The following file is being updated. Information is not confirmed to be correct

# Headless Connection

## M28 Api

To find a server, you'll need to retrieve a server id from the m28 api, from there you can generate a socket url which you can connect to - all of which is described in the first passage of [api.md](./api.md).

- Connections are always secure

---

## HTTP Headers

Diep.io currently has many security measures to block out headless connection. One of these securities is a strict checking of HTTP headers on incoming websocket connections, and so we need to override this and connect with browser-like headers.

Credit to Binary:

```js
const https = require('https');
https.get = new Proxy(https.get, {apply(target, thisArg, args)
{
  if (args[0]?.headers?.Origin === "https://diep.io") // Don't interfere with other connections
  {
    args[0].headers = {
      'Host': args[0].host,
      'User-Agent': '',
      'Pragma': '',
      'Cache-Control': '',
      ...args[0].headers
    };
  }
  return target.apply(thisArg, args);
}});
```

There are 2 rules the HTTP headers must satisfy:
- The headers `User-Agent`, `Pragma` and `Cache-Control` must exist, otherwise your connection will get rejected with a [403](https://httpstatuses.com/403) response code. They can simply be left empty or have a fake value, however M28 may begin to check for this at any time so it is recommended to provide realistic values.
- The `Host` header must be anywhere above the `Origin` and `Sec-WebSocket-Key` headers, this is true with every modern browser except for the [ws](https://www.npmjs.com/package/ws) module. Nothing happens if you fail this check, you will not get disconnected or banned. Instead, the server will send completely random packets to try trick you into thinking that you got packet shuffling wrong.

## Initiation and Packet Encoding / Decoding

The first packet send is always the [0x00 Init packet](../outgoing.md#0x00-init-packet), and this does not have to be encoded. The following packet will either be a [0x01 Invalid Build](../incoming.md#0x01-outdated-client-packet), or an encoded [JS Int Eval packet](../incoming.md#0x0d-int-js-challenge-packet) (or sometimes a [PoW Challenge](./incoming.md#0x0b-pow-challenge-packet)). Sending encoded and decoding incoming packets will be explained fully in [api.md](./crypto.md). 

> some more info
