/**
 * Generates a universally unique identifier (UUID) in version 4 format.
 * @returns {string} A random UUID string.
 */
function gen_uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * Generates a token string based on the user ID.
 * @param {string} userID - The user ID to encode in the token.
 * @returns {string} A token string composed of base64-encoded parts: userID, current timestamp, and a UUID.
 */
function gen_token(userID) {
    return btoa(userID) + '.' + btoa(Date.now()) + '.' + btoa(gen_uuid());
}

module.exports = gen_token;