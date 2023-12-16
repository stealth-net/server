const gen_token = require("../utils/gen_token.js");
const class_to_json = require("../utils/class_to_json.js");
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

class User {
    constructor(options = {}) {
        if(options.token) {
            const userData = queue_search(options.token, "token");
            
            for(let key in userData) {
                this[key] = userData[key];
            };
        } else if(!options.token && options.username && options.email && options.password) {
            this.id = stealth.id_manager.getNextID();
            this.token = options.token || gen_token(this.id);

            this.badges = [];
            this.friends = [];
            this.friendRequests = [];
            this.friendRequestsOwn = [];
            this.guilds = [];
            this.status = "online";
            this.pfpURL = "/mainpage/images/logo_transparent.png";
            this.creationTime = Date.now();
            
            this.username = options.username;
            this.email = options.email;
            this.password = options.password;
            
            this.save();
        };
    };
    send(type, ...data) {
        const socket = this.getSocket();
        if(!socket) return false;

        socket.emit(type, ...data);

        return true;
    };
    getSocket() {
        return stealth.sockets[this.id] || null;
    };
    setStatus(type) {
        this.set("status", type);
    };
    set(key, value) {
        database.setValue(value, this.id, key);
    };
    save() {
        database.data[this.id] = class_to_json(this);
        database.save();
    };
};

module.exports = { User, queue_search };