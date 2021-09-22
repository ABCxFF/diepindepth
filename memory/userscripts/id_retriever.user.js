// ==UserScript==
// @name         Player ID Retriever
// @version      1.0.0
// @description  Gets your player's entity id
// @namespace    github.com/ABCxFF
// @author       ABC
// 
// @match        https://diep.io/
// @run-at       document-start
// @grant        none
// 
// @require      https://gist.githubusercontent.com/ABCxFF/b089643396fbb933996966b5ab632821/raw/6f93ee2bac45e308067fafff21e1110132f9ca0e/wail.js
// ==/UserScript==

const instantiate = WebAssembly.instantiate;

WebAssembly.instantiate = function(buffer, options) {
    const wail = new WailParser(new Uint8Array(buffer));

    wail.parse();

    main(options, wail);

    return instantiate(buffer, options);
}

async function main(options, { _parsedSections: parsedSections }) {
    const memory = Object.values(options.a).find(o => o instanceof WebAssembly.Memory);
    const HEAPU32 = new Uint32Array(memory.buffer);
    const HEAPU16 = new Uint16Array(memory.buffer);

    const [buildHash] = document.body.innerHTML.match(/[a-f0-9]{40}/g)
    const wasmjs = await fetch("https://diep.io/build_" + buildHash + ".wasm.js").then(r => r.text());

    const getExportKey = name => (i => wasmjs.slice(i, wasmjs.indexOf('"', i)))(wasmjs.lastIndexOf(name + '"') + 18 + name.length);

    const HAS_TANK = getExportKey("_has_tank");
    const hasTankIndex = parsedSections.find(s => s.id === 7).results.find(r => r.fieldStr === HAS_TANK).index
    const importCount = parsedSections.find(s => s.id === 2).results.reduce((a, b) => b.kind === 'func' ? a + 1 : a, 0)
    const hasTank = parsedSections.find(s => s.id === 10).results[hasTankIndex - importCount]

    const instructionOffset = hasTank.instructions.findIndex((e, i, l) => l[i + 3] && l[i + 3].immediates[0] - e.immediates[0] === 4)
    const cameraVector = hasTank.instructions[instructionOffset].immediates[0];
    const playerIDOffset = hasTank.instructions[instructionOffset + 13].immediates[1];

    let lastId = -1;
    setInterval(() => {
        let currentId = HEAPU16[(HEAPU32[HEAPU32[cameraVector >> 2] >> 2] + (playerIDOffset - 2)) >> 1];
        if (lastId !== currentId) console.log(`Player ID Detected: <${lastId = currentId}, ${HEAPU16[(HEAPU32[HEAPU32[cameraVector >> 2] >> 2] + playerIDOffset) >> 1]}>`);
    }, 500);
}
