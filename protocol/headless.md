# STARTING A HEADLESS CONNECTION

## DISCLAIMER
To start a headless WebSocket connection with Diep.io, you need to be familiar with WebSockets. If you aren't, please head over to [this](https://www.youtube.com/watch?v=FduLSXEHLng) tutorial before you begin making a Diep.io Headless Connection. We will be using Node.js in order to create a WebSocket connection, as it is i

## STARTING A CONNECTION
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
