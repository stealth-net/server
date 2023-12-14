const gen_uuid = require("./gen_uuid.js");

function gen_token(UID) {
    return btoa(UID) + '.' + btoa(Date.now()) + '.' + btoa(gen_uuid());
};

module.exports = gen_token;