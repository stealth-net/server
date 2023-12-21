const gen_token = require("../utils/gen_token.js");
const class_to_json = require("../utils/class_to_json.js");
// require('dotenv').config({ path: "./.env" });
const db = stealth.database.users;
// const sqlcipher = require("@journeyapps/sqlcipher").verbose();

// sqlcipher.cached.Database.prototype.open = function open(cfg, filename, mode, cb) {
//     this.constructor.prototype.open.call(this, cfg, filename, mode, cb);
//     this.run(`PRAGMA key = '${process.env.databaseKey}'`);
// };

// const db = new sqlcipher.Database("./database/users.db");

// db.run(`
//     CREATE TABLE IF NOT EXISTS user (
//         id INTEGER PRIMARY KEY,
//         token TEXT,
//         badges BLOB, -- assuming badges is an array of integers
//         friends BLOB, -- assuming friends is an array of integers
//         friendRequests BLOB, -- assuming friendRequests is an array of integers
//         friendRequestsOwn BLOB, -- assuming friendRequestsOwn is an array of integers
//         guilds BLOB, -- assuming guilds is an array of integers
//         messages BLOB, -- assuming messages is an array of integers
//         status TEXT,
//         pfpURL TEXT,
//         creationTime INTEGER,
//         username TEXT,
//         display_name TEXT,
//         email TEXT,
//         password TEXT
//     )
// `);

function queue_search(queue, key) {
    const userIds = Object.keys(db.data);
    
    var result = null;

    userIds.forEach(ID => {
        const value = db.getValue(ID, key);

        if(value == queue)
            result = db.getValue(ID);
    });

    return result;
};

function safe_user(user) {
    return {
        username: user.username,
        pfpURL: user.pfpURL,
        status: user.status,
        id: user.id
    };
};

function fetch_users(ids, safe) {
    return ids.map(id => {
        const user = new User({ token: queue_search(id, "id").token });
        
        var data = user;
        if(safe) data = safe_user(user);

        return data;
    });
};

class User {
    constructor(options = {}) {
        if(options.token) {
            const userData = queue_search(options.token, "token");
            
            for(let key in userData) {
                this[key] = userData[key];
            };
        } else if(options.password) {
            this.id = stealth.id_manager.getNextID();
            this.token = options.token || gen_token(this.id);

            this.badges = [];
            this.friends = [];
            this.friendRequests = [];
            this.friendRequestsOwn = [];
            this.guilds = [];
            this.messages = [];
            this.status = "online";
            this.pfpURL = "/mainpage/images/logo_transparent.png";
            this.creationTime = Date.now();
            
            this.username = options.username;
            this.display_name = options.username;
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
        this.status = type;
        this.set("status", type);
    };
    set(key, value) {
        db.setValue(value, this.id, key);
    };
    save() {
        db.data[this.id] = class_to_json(this);
        db.save();
    };
};

module.exports = { User, queue_search, fetch_users, safe_user };