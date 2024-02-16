function serialize(array) {
    return JSON.stringify(array);
}

function deserialize(serializedArray) {
    return JSON.parse(serializedArray);
}

module.exports = { serialize, deserialize }