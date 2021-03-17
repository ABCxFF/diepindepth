# STARTING A HEADLESS CONNECTION

## DISCLAIMER
To start a headless WebSocket connection with Diep.io, you need to be familiar with WebSockets. If you aren't, please head over to [this](https://www.youtube.com/watch?v=FduLSXEHLng) tutorial before you begin making a Diep.io Headless Connection. We will be using Node.js in order to create a WebSocket connection, as it is considered the easiest way to build a WebSocket connection to connect to Diep.io.

## STARTING A CONNECTION

### FINDING SERVER
To start a connection, you'll need to decide which gamemode and region you want to connect to. Refer to [here](https://github.com/CoderSudaWuda/diepindepth/edit/main/protocol/m28api.md) if you want to figure out how to validly express a gamemode or region. To figure out the ID, you can use this snippet of code to find it.
```js
const body = await fetch('https://api.n.m28.io/endpoint/diepio-${gamemode}/findEach'); // Fetches from M28's API in the specific gamemode you want to figure out server IDs.
const response = await body.json(); // Make the response parsable as JSON.
/*
The format of response is:
servers: {
   region: {
      id: "ServerID", // We only need this, though we could use IPv4 and IPv6 to make a connection
      ipv4: "ServerIP",
      ipv6: "ServerIPv6Block"
   }
}
*/
const serverID = response.servers[`vultr-${region}`]?.id; // ?. is Optional Chaining, which checks if value is undefined/null, and if it is stops, otherwise continues.
```
Once you get your desired server, you can connect to it via the URL `wss://${serverID}.s.m28n.net`.

### VALID CLIENT HEADERS
Diep.io currently has many security measures to block out bots and only allow valid clients to connect. One of these features are checking for headers when a socket connection is being made, and the order of the headers. A WebSocket connection headlessly has a different order and does not have the same specific headers compared to browser. We can easily avoid this by overwriting the `https.get` function, from the built in Node.js module "https". The "ws" module in Node.js requires https.get to start a WebSocket connection with a server. We can edit the headers' order via this code snippet (credit to [Binary](https://github.com/binary-person)).
```js
const _https_get = https.get; 
https.get = function (...args) { 
    if (args[0]?.headers) { // Checks for headers
        args[0].headers = { // Sets headers
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
        
        Object.keys(args[0].headers).forEach((key) => { // Removes all undefined keys in case M28 starts checking for them.
            if (!args[0].headers[key]) {
                delete args[0].headers[key];
            }
        });
    }
    return _https_get(...args);
};
```
