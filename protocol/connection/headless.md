> The following file is being updated. Information is not confirmed to be correct

# Headless Connection

## M28 API

To find a server, you'll need to retrieve a server id from the m28 api, from there you can generate a socket URL which you can connect to - all of which is described in the first passage of [api.md](./api.md).

- Connections are always secure

---

## HTTP Headers

Diep.io currently has many security measures to block out headless connections. One of these securities is strict checking of HTTP headers on incoming WebSocket connections, and so we need to override this and connect with browser-like headers.

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
- The headers `User-Agent`, `Pragma` and `Cache-Control` must exist, otherwise, your connection will get rejected with a [403](https://httpstatuses.com/403) response code. They can simply be left empty or have a false value, however, Zeach may begin to check for this at any time so it is recommended to provide realistic values.
- The `Host` header must be anywhere above the `Origin` and `Sec-WebSocket-Key` headers, this is true with every modern browser except for the [ws](https://www.npmjs.com/package/ws) module. Nothing happens if you fail this check, you will not get disconnected or banned. Instead, the server will send completely random packets to try to trick you into thinking that you got packet shuffling wrong.

## Initiation and Packet Encoding / Decoding

The first packet send is always the [0x00 Init packet](../serverbound.md#0x00-init-packet), and this does not have to be encoded. The following packet will either be a [0x01 Invalid Build](../clientbound.md#0x01-outdated-client-packet), or an encoded [0x0D JS Int Eval packet](../clientbound.md#0x0d-int-js-challenge-packet), followed by a [0x0B PoW Challenge](../clientbound.md#0x0b-pow-challenge-packet). The basic idea of encoding and decoding packets ("Shuffling") is explained in [Packet Encoding and Decoding](../crypto.md).

## Ip Limit and Overcoming it

Diep.io has a system in place that limits the amount of possible connections per ip. As of now, this limit is 2 connections per ip per server. Since the ips appear to be stored locally on the server, one can still connect to other servers (Even if servers may have multiple arenas open at the same time, the "block" would still be persistent. On the other hand, one might connect to a server in another region which would work completely normal). There are currently two known solutions to this "problem". 

### Proxies

Any proxies that support secure websocket connections can be used as some sort of middleman between server an ones own ip. More information on this is available [here](https://www.varonis.com/blog/what-is-a-proxy-server/) and [here](https://www.npmjs.com/package/https-proxy-agent).

### Ipv6 Subranging

As of now, a /64 block of IPv6 ips can only be used for 2 connections (like regular IPv4 addresses). Therefore one will need a range of at least /63. The process of setting this up will not be explained any further here.
