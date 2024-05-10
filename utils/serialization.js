const { log } = require("./log.js");

/**
 * Serializes an array into a JSON string.
 * @param {Array} array - The array to serialize.
 * @returns {string} The serialized JSON string.
*/
function serialize(array) {
    try {
        return JSON.stringify(array);
    } catch (error) {
        log("ERROR", "Error occurred during serialization:", error);
        return null;
    }
}

/**
 * Deserializes a JSON string into an array.
 * @param {string} serializedArray - The JSON string to deserialize.
 * @returns {Array} The deserialized array.
*/
function deserialize(serializedArray) {
    try {
        return JSON.parse(serializedArray);
    } catch (error) {
        log("ERROR", "Error occurred during deserialization:", error);
        return [];
    }
}

module.exports = { serialize, deserialize }