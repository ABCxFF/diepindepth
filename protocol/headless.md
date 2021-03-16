***STARTING A HEADLESS CONNECTION***

## DISCLAIMER
To start a headless WebSocket connection with Diep.io, you need to be familiar with the Node.js module "ws". If you aren't, please head over to [this](https://www.youtube.com/watch?v=FduLSXEHLng) tutorial before you begin making a Diep.io Headless Connection.

## STARTING A CONNECTION
To start a connection, you'll need to decide which gamemode and region you want to connect to. Refer to [here](#gamemode-and-region-tables) if you want to figure out how to validly express a gamemode or region. To figure out the ID, you can use this snippet of code to find it.
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
const serverID = response.servers[`vultr-${region}`]; 
```

## GAMEMODE AND REGION TABLES 
| Short Names | Actual Names |
| ----------- | ----------- |
| `eu, amsterdam, europe` | `amsterdam` |
| `miami` | `miami`
| `la` | `la` |
| `singapore, sg, asia` | `singapore` |
| `sydney, syd, australia` | `sydney` |
| `ffa` | `ffa` |
| `survival` | `survival` |
| `2tdm, 2teams` | `teams` |
| `4tdm, teams` | `4teams` |
| `domination, dom` | `dom` |
| `tag` | `tag` |
| `maze, spin2taemgamemode` | `maze` |
| `sbx, sandbox` | `sandbox` |
