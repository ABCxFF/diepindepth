This is still being worked on semi-actively, progress updates are posted in the [roadmap](https://github.com/ABCxFF/diepindepth#roadmap)

---

# **:DiepInDepth**

Largest collection of protocol, memory, and other hacky information for the browser game [diep.io](https://diep.io/).

What started off as an attempt to parse game leaderboards out of packets is now a collection of information about the insides of diep.io. Including information such as packet encoding/decoding, packet protocol, memory structures, a bit of physics, wasm parsing, game code reversal, and much more.

### **Sections**

There are 4 sections that divide up the information collected.

1. Game Protocol ([`protocol/`](./protocol/))  
   Including incoming and outgoing packets, encoding/decoding, m28 server list api and websocket connections
2. WebAssembly Reversal ([`wasm/`](./wasm/))  
   Including any means necessary, asm.js conversion, specific functions, automation of reversing constants and pointers, understanding of emscripten
3. Memory Management ([`memory/`](./memory/))  
   Including storage of entities, tanks, the gui, and the structure and way things are stored
4. Extras ([`extras/`](./extras/))  
   Including any extra information, fun facts, misc algorithms, and any physics not provided in [Spade Squad](http://spade-squad.com)

## **Roadmap**

https://github.com/ABCxFF/diepindepth/projects/2

## **Contributors**

This repository was made possible with the help of the Diep In Depth team. In order of join date, thank you to [ABC](https://github.com/ABCxFF), [ALPH2H](https://github.com/ALPH2H), [Excigma](https://github.com/Excigma), [HueHanaejistla](https://github.com/HueHanaejistla), [Diep7444](https://github.com/diepiodiscord), [Cazka](https://github.com/Cazka), [shlong](https://github.com/shlongisdookielol), [Pola](https://github.com/PiotrDabkowski), [Altanis](https://github.com/CoderSudaWuda), [Binary](https://github.com/binary-person), [Perunahamsteri](https://github.com/Perunahamsteri), [Shädam](https://github.com/supahero1), and [CX](https://github.com/CX88) for their work.


If *you* have additional information you can / want to share, please, pull requests are welcome!
