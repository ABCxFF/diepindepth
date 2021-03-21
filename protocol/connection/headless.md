> The following file is being updated. Information is not confirmed to be correct

# Headless Connection

## M28 Api

To find a server, you'll need to retrieve a server id from the m28 api, from there you can generate a socket url which you can connect to - all of which is described in the first passage of [api.md](./api.md).

- Connections are always secure

---

## Client Headers

Diep.io currently has many security measures to block out headless connection. One of these securities is a strict checking of headers on incoming connections, and so we need to override this and connect with browser-like headers.

> someone put info here, and on Binary's code

## Initiation and Packet Encoding / Decoding

The first packet send is always the [0x00 Init packet](../outgoing.md#0x00-init-packet), and this does not have to be encoded. The following packet will either be a [0x01 Invalid Build](../incoming.md#0x01-outdated-client-packet), or an encoded [JS Int Eval packet](../incoming.md#0x0d-int-js-challenge-packet) (or sometimes a [PoW Challenge](./incoming.md#0x0b-pow-challenge-packet)). Sending encoded and decoding incoming packets will be explained fully in [api.md](./crypto.md). 

> some more info
