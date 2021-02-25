# **Incoming Packets**

Also known as clientbound, these packets, after being encoded, are sent from the server to the client. Most of these packets aren't too commplex once you understand the basics of a reader, with the exception of the incoming `0x00` packet.

| Header | Name              | Description                                            |
| ------ | ----------------- | ------------------------------------------------------ |
| `0x00` | Update            | Creates, updates, and deletes objects and entities     |
| `0x01` | Outdated Client   | Response to invalid build in the init packet           |
| `0x02` | Compressed Packet | LZ4 compressed packet of any header                    |
| `0x03` | Notification      | Sends notifications in game                            |
| `0x04` | Server Info       | Send information about the server, host & region       |
| `0x05` | Heartbeat         | Ping pong packet                                       |
| `0x06` | Party Link        | Sends the party link if available                      |
| `0x07` | Accept            | Sent after initial handshake, on client acceptance     |
| `0x08` | Achievement       | Updates clientside achievements from the server        |
| `0x09` | Invalid Party     | Sent when the party in the init packet is invalid      |
| `0x0A` | Player Count      | Global count of clients connected                      |
| `0x0B` | PoW Challenge     | Sends a required proof of work challenge               |
| `0x0C` | Unnamed           | Unused packet                                          |
| `0x0D` | Eval              | Sends (obfuscated) ks code to be run. Result is an int |

---

## **`0x00` Update Packet**

---

## **`0x01` Outdated Client Packet**

---

## **`0x02` Compressed Packet**

---

## **`0x03` Notification Packet**

---

## **`0x04` Server Info Packet**

---

## **`0x05` Heartbeat Packet**

---

## **`0x06` Party Link Packet**

---

## **`0x07` Accept Packet**

---

## **`0x08` Achievement Packet**

---

## **`0x09` Invalid Party Packet**

---

## **`0x0A` Player Count Packet**

---

## **`0x0B` PoW Packet**

---

## **`0x0C` Unnamed Packet**

---

## **`0x0D` Eval Packet**
