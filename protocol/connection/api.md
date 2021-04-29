# [`M28 API`](https://api.n.m28.io/)

The M28 api has only 3 api paths that relate to diep: `/server`, `endpoint/diepio-${gamemode}`, and `endpoint/latency`. All but `/server` are necessary to the client when connecting to a gamemode server.

First, its worth mentioning that to connect to a server by id, append `.s.m28n.net` to its id. Example would be id=`abcd`, ws server=`wss://abcd.s.m28n.net`.

---

## [`/server`](https://api.n.m28.io/server/diepindepth) Endpoint

This endpoint responds with info about a server via its ID. Unlike the other endpoints, this endpoint is part of the M28 api system, and is not part of some sort of game or game server.

URL -> `https://api.n.m28.io/server/{server-id}`

Example request/response
```http
GET /server HTTP/2

HTTP/2 200 OK
Host: api.n.m28.io
Content-Type: application/json; charset=utf-8
Content-Length: 87

{
  "id": "bshn",
  "ipv4": "144.202.121.166",
  "ipv6": "2001:19f0:6001:3e70:5400:03ff:fe3e:fb56"
}
```

---

## DiepIO Game Server Endpoints

This endpoint lists servers hosted on the m28 server api for diep.io. It is used to find a server by gamemode, one server per region is listed, so there may be more in the region than shown..

URL `https://api.n.m28.io/endpoint/diepio-{gamemode}/findEach`

Example request/response
```http
GET /endpoint/diepio-sandbox/findEach HTTP/2

HTTP/2 200 OK
Host: api.n.m28.io
Content-Type: application/json; charset=utf-8
Content-Length: 523

{
  "servers": {
    "vultr-la": {
      "id": "bshn",
      "ipv4": "144.202.121.166",
      "ipv6": "2001:19f0:6001:3e70:5400:03ff:fe3e:fb56"
    },
    "vultr-miami": {
      "id": "bshs",
      "ipv4": "45.77.74.230",
      "ipv6": "2001:19f0:9002:16b8:5400:03ff:fe3e:fb60"
    },
    "vultr-sydney": {
      "id": "bshx",
      "ipv4": "149.28.161.200",
      "ipv6": "2001:19f0:5801:1e07:5400:03ff:fe3e:fb61"
    },
    "vultr-amsterdam": {
      "id": "bst3",
      "ipv4": "136.244.110.102",
      "ipv6": "2001:19f0:5001:08f5:5400:03ff:fe41:23bf"
    },
    "vultr-singapore": {
      "id": "bsi0",
      "ipv4": "45.76.185.119",
      "ipv6": "2001:19f0:4400:4b74:5400:03ff:fe3e:fb63"
    }
  }
}
```

> There is also a gamemodeless request that gives all servers, regardless of gamemode, `https://api.n.m28.io/endpoint/diepio/findEach` - this is no longer being used in production.

---

## [`latency`](https://api.n.m28.io/endpoint/latency/findEach) Endpoint

Similar to the others, this endpoint returns servers based on region, but they are not diep.io servers - they are latency servers. Upon connecting to these servers (via ws) and sending any data that is prefixed with a null byte, the server will echo back the same buffer.

Diep.io uses these servers to find out the best region to connect to, by sending a 0x00 byte, and then calculating the time between sending the byte and receiving the echo. Whichever has the least time between sending and receiving will be the region you will eventually connect to when selecting gamemode servers.

URL -> `https://api.n.m28.io/endpoint/latency/findEach`

Example request/response (minified for size)
```http
GET /endpoint/latency/findEach HTTP/2

HTTP/2 200 OK
Host: api.n.m28.io
Content-Type: application/json; charset=utf-8
Content-Length: 1326

{"servers":{"linode-fremont":{"id":"bdre","ipv4":"45.33.43.51","ipv6":null},"linode-dallas":{"id":"bot4","ipv4":"172.104.198.179","ipv6":null},"linode-singapore":{"id":"bmj2","ipv4":"172.104.35.61","ipv6":null},"linode-frankfurt":{"id":"bp4q","ipv4":"192.46.233.239","ipv6":null},"linode-newark":{"id":"ampj","ipv4":"50.116.59.175","ipv6":null},"linode-london":{"id":"boku","ipv4":"109.74.195.204","ipv6":null},"vultr-seattle":{"id":"aqfg","ipv4":"104.238.157.145","ipv6":"2001:19f0:8001:137b:5400:02ff:fe9e:201e"},"vultr-tokyo":{"id":"bees","ipv4":"66.42.32.35","ipv6":"2001:19f0:7001:5356:5400:02ff:fef8:4827"},"vultr-la":{"id":"bp97","ipv4":"104.207.153.155","ipv6":"2001:19f0:6001:3798:5400:03ff:fe2a:e5dc"},"vultr-miami":{"id":"blwx","ipv4":"207.246.71.211","ipv6":"2001:19f0:9002:2764:5400:03ff:fe18:6bba"},"vultr-frankfurt":{"id":"bemq","ipv4":"136.244.92.41","ipv6":"2a05:f480:1800:05ac:5400:02ff:fef9:d8be"},"vultr-sydney":{"id":"bnut","ipv4":"149.28.176.43","ipv6":"2401:c080:1800:4cf8:5400:03ff:fe23:13ae"},"vultr-chicago":{"id":"boy7","ipv4":"149.28.118.130","ipv6":"2001:19f0:5c01:1929:5400:03ff:fe29:83a7"},"vultr-amsterdam":{"id":"bnbb","ipv4":"45.63.43.99","ipv6":"2a05:f480:1400:0cb1:5400:03ff:fe1f:863f"},"vultr-singapore":{"id":"as8s","ipv4":"66.42.56.203","ipv6":"2001:19f0:4401:99e:5400:02ff:fe9e:f99a"}}}
```
