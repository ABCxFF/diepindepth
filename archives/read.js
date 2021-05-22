const types = require('./types');
const fields = require('./fields');
const conf = require('./conf');

const readFields = (view) => {
    const order = Array(view.getUint8(view.at++));

    for (let i = 0; i < order.length; ++i) {
        const fieldGroup = view.getUint8(view.at);
        const id = view.getUint8(view.at + 1);
        view.at += 2;

        const field = fields.find(f => f.fieldGroup === fieldGroup && f.id === id);

        if (!field) {
            console.warn('Unknown field @' + (view.at - 2).toString(16) + ' : ' + fieldGroup + ':' + id);
            continue;
        }

        order[i] = field.name;
    }

    return order;
}

module.exports = (buffer) => {
    buffer = new Uint8Array(buffer).buffer;

    const view = new DataView(buffer);
    const u8 = new Uint8Array(buffer);

    if (view.getUint32(u8.length - 4, false) !== 0x414243FF) throw new TypeError('Invalid magic. Requires ABCxFF');

    const formatted = {};

    formatted.build = new TextDecoder().decode(u8.subarray(0, conf.HASH_SIZE));
    formatted.archiveDate = view.getFloat32(conf.HASH_SIZE);

    view.at = conf.HASH_SIZE + 4

    while (view.at < u8.length - 4) {
        const id = view.getUint8(view.at++);
        const type = types[id];

        const size = view.getUint32(view.at);
        view.at += 4;

        if (!type) {
            console.warn('Invalid entry @' + (view.at - 5).toString(16) + ' : ' + id);
            view.at += size;
            continue;
        }

        switch (type) {
            case "fields":
                formatted.fields = readFields(view);
                break;
            default:
                formatted[type] = view.getUint32(view.at);
                view.at += 4;
                break;
        }
    }

    return formatted;
}