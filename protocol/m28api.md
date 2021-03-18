# M28 API

This API has 3 major endpoints: `/server`, `/diepio`, and `/latency`. These endpoints are all necessary when Diep.io loads, and some are crucial when you're making your own WebSocket client.

## SERVER ENDPOINT
This endpoint retrieves info about a server via its ID, then sends it in JSON Format.

Input URL -> `https://api.n.m28.io/server/{server-id}`

Output Response -> `{ id, ipv4, ipv6 }`
