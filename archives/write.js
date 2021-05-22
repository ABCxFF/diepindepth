
const types = require('./types');
const fields = require('./fields');
const conf = require('./conf');

const buffer = new ArrayBuffer(4000);

const inverseTypes = {};
for (let i = 0; i < types.length; ++i) inverseTypes[types[i]] = i;

// Hash's size is constant length 40.
const hashToBuf = (hash) => {
    if (conf.HASH_SIZE === 40) return new TextEncoder().encode(hash);
    else if (conf.HASH_SIZE !== 20) return;

    const out = new Uint8Array(20);
    for (let i = 0; i < 40; i += 2) {
        out[i >> 1] = (parseInt(hash[i]) << 4) | parseInt(hash[i + 1]);
    }

    return out;
}

const writeFields = (fieldOrder, view = new DataView(new ArrayBuffer(fieldOrder.length << 1))) => {
    if (!view.at) view.at = 0;

    view.setUint8(view.at++, fieldOrder.length);

    for (const fieldName of fieldOrder) {
        const field = fields.find(f => f.name === fieldName);

        if (!field) throw ReferenceError('Invalid field');

        view.setUint16(view.at, (field.fieldGroup << 8) | field.id);
        view.at += 2;
    }

    return view;
}

module.exports = (formatted) => {

    const view = new DataView(buffer);
    const u8 = new Uint8Array(buffer);

    const hash = hashToBuf(formatted.build);
    u8.set(hash);

    view.setFloat32(hash.length, formatted.archiveDate || Date.now());
    view.at = hash.length + 4;

    delete formatted.build;
    delete formatted.archiveDate

    const data = Object.entries(formatted).sort(([a], [b]) => inverseTypes[b] - inverseTypes[a])

    for (let [type, val] of data) {
        const id = inverseTypes[type];

        if (!id) throw new TypeError('Invalid entry ' + type)

        view.setUint8(view.at, id);
        const sizeAt = ++view.at;

        view.at += 4;
        switch (type) {
            case "fields":
                writeFields(val, view);
                break;
            // case "socket_index_pointer":
            // case "recv_packet":
            // case "send_packet":
            // case "fieldgroup_root_ptr":
            default:
                view.setUint32(view.at, val);
                view.at += 4;
                break;
        }
        view.setUint32(sizeAt, (view.at - 4) - sizeAt);
    }
    view.setUint32(view.at, 0x414243FF, false);

    return new Uint8Array(view.buffer).subarray(0, view.at + 4);
}

