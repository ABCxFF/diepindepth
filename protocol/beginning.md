***STARTING A HEADLESS CONNECITON***

When establishing a connection, you need to send an initialization packet (outgoing): [0x00](https://github.com/ABCxFF/diepindepth/blob/main/protocol/outgoing.md#0x00-init-packet)

*If an invalid build is sent, an outdated client packet will be sent (incoming): [0x01](https://github.com/ABCxFF/diepindepth/blob/main/protocol/incoming.md#0x01-outdated-client-packet)*

If the format and build is correct in the initialization packet, a JS Challenge packet (incoming, [0x0d](https://github.com/ABCxFF/diepindepth/blob/main/protocol/incoming.md#0x0b-pow-challenge-packet)] and a PoW Challenge packet (incoming, [0x0b](https://github.com/CoderSudaWuda/diepindepth/blob/main/protocol/incoming.md#0x0d-js-challenge-packet)) will be sent.

**You must answer the JS Challenge packet first, then you can solve the PoW Challenge packet in order to successfully authorized by Diep.io.**

If the party in the initilization packet is invalid, an Invalid Party packet (incoming, [0x09](https://github.com/ABCxFF/diepindepth/blob/main/protocol/incoming.md#0x09-invalid-party-packet)) is sent.

If everything goes well, then an Authorized packet will be sent (incoming, [0x07](https://github.com/ABCxFF/diepindepth/blob/main/protocol/incoming.md#0x07-accept-packet)).

***CONNECTION WARNINGS***

- You need to make sure the headers of the WebSocket resemble those of an actual browser client. You can do this via overwriting a function in the https module, called "get" (credits to [Binary](https://github.com/binary-person)). Code will be provided [here](./beginning.md#header-hijacking).
- Sending an invalid packet header, or an invalid packet format (**EXCEPT 0X00**) will get you IP Banned from the specific Diep.io server you are connecting to.

## Header Hijacking
```js
const https = require('https')
const _https_get = https.get;
https.get = (...args) => {
    if (args[0]?.headers) {
        args[0].headers = {
            Host: args[0].host,
            Connection: undefined,
            Pragma: undefined,
            'Cache-Control': undefined,
            'User-Agent': undefined,
            Upgrade: undefined,
            Origin: undefined,
            'Sec-WebSocket-Version': undefined,
            'Accept-Encoding': undefined,
            'Accept-Language': undefined,
            'Sec-WebSocket-Key': undefined,
            'Sec-WebSocket-Extensions': undefined,
            ...args[0].headers,
        };
    }

    return _https_get(...args);
};
```
