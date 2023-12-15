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
    var user = userData;

    if(userData instanceof User) user = class_to_json(user);

    for(const key in user) {
        if(typeof user[key] == "object") {
            for(const key2 in user[key]) {
                if(!isNaN(key)) continue;
                database.setValue(user[key][key2], user.id, key, key2);
                continue;
            };
        };

        database.setValue(user[key], user.id, key);
    };
};

module.exports = { queue_search, user_search, save };