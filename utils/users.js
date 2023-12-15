const database = stealth.database.users;

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