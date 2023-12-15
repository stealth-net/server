const CryptedJSONdb = require("cryptedjsondb");

const class_to_json = require("./class_to_json.js");
const User = require("../components/User.js");

const database = new CryptedJSONdb("./database/users.json", {
    encryption: stealth.config.encryptDatabase,
    key: stealth.env.databaseKey,
    minify: stealth.env.minifyDatabase
});

function queue_search(queue, key) {
    const userIds = Object.keys(database.data);
    
    var result = null;

    userIds.forEach(ID => {
        const value = database.getValue(ID, key);

        if(value == queue)
            result = database.getValue(ID);
    });

    return result;
};

function user_search(queue) {
    var result = null;

    result = queue_search(queue, "username");

    if(result == null) 
        result = queue_search(queue, "email");
    if(typeof queue == "number")
        result = Object.keys(database.data)[queue.toString()];

    return result;
};

function save(userData) {
    database.data[userData.id] = userData;
    database.save();
};

module.exports = { queue_search, user_search, save };