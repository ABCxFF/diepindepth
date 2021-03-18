# M28 API

This API has 3 major endpoints: `/server`, `/diepio`, and `/latency`. These endpoints are all necessary when Diep.io loads, and some are crucial when you're making your own WebSocket client.

## SERVER ENDPOINT
This endpoint retrieves info about a server via its ID, then sends it in JSON Format.

Input URL -> `https://api.n.m28.io/server/{server-id}`

Output Response -> `{ id, ipv4, ipv6 }`

## DIEPIO ENDPOINT
This endpoint gives all necessary data about a random cherry-picked server in each region of the gamemode specified. It is used to connect to a random server in the region determined by the latency endpoint.

Input URL -> `https://api.n.m28.io/endpoint/diepio-{gamemode}/findEach`

Output Response -> `{ servers: { RegionName: { id, ipv4, ipv6 } } }`

## LATENCY ENDPOINT
This endpoint is much different from the other two. This endpoint is reached via going to `https://api.n.m28.io/endpoint/latency/findEach`, and the Output Response is the same as the Diep.io endpoint. However, it links to completely different WebSocket Server IDs. When connecting to these WebSocket servers, you need to send a singular 0x00 byte. Upon doing this, the server will send you back an empty buffer. Diep.io connects to every server ID in the response, sends a 0x00 byte, and then calculates the time between sending the byte and receiving the packet. Whichever has the least time between sending and receiving will be the region you will connect to.

Input URL -> `https://api.n.m28.io/endpoint/latency/findEach`

Output Response -> `{ servers: { RegionName: { id, ipv4, ipv6 } } }`
