const gen_token = require("../utils/gen_token.js");
const log = require("../utils/log.js");
const db = stealth.database;

const query = `
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    token TEXT,
    badges TEXT,
    friends TEXT,
    friendRequests TEXT,
    friendRequestsOwn TEXT,
    guilds TEXT,
    messages TEXT,
    status TEXT,
    pfpURL TEXT,
    creationTime INTEGER,
    username TEXT,
    display_name TEXT,
    email TEXT,
    password TEXT
)`;
db.run(query, function(err) {
    if(err) {
        log("ERROR", "Failed to create users table:", err.message);
    }
});

/**
 * Searches for a user in the database based on a specific key.
 * @param {string} queue - The value to search for in the database.
 * @param {string} key - The key to search for in the database.
 * @returns {Promise<Object>} A promise that resolves with the user row if found, or rejects with an error.
 */
function query_search(queue, key) {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM users WHERE ${key} = ?`;
        db.get(query, [queue], (err, row) => {
            if(err) {
                reject(new Error(`SQLITE_ERROR: no such table: users --> in Database#get('${query}', [ '${queue}' ])`));
            } else {
                resolve(row);
            }
        });
    });
}

/**
 * Creates a safe user object with limited properties.
 * @param {Object} user - The user object to make safe.
 * @returns {Object} A safe user object with limited properties.
 */
function safe_user(user) {
    return {
        username: user.username,
        pfpURL: user.pfpURL,
        status: user.status,
        id: user.id
    }
}

/**
 * Fetches users based on their IDs.
 * @param {Array} ids - The array of user IDs to fetch.
 * @param {boolean} safe - A flag to determine if fetching should be safe.
 * @returns {Array} An array of fetched users.
 */
async function fetch_users(ids, safe) {
    const users = [];
    for (let id of ids) {
        try {
            const userRow = await query_search(id.toString(), "id");
            if(userRow) {
                const user = new User();
                await user.initWithToken(userRow.token);

                users.push(safe ? safe_user(user) : await user.getAllProperties());
            }
        } catch (error) {
            console.error("Failed to fetch user:", error.message);
        }
    }
    return users;
}

/**
 * Represents a user in the system.
 */
class User {
    /**
     * @property {string} id - The unique identifier of the user.
     * @property {string} token - The authentication token of the user.
     * @property {string} badges - Array of user badges.
     * @property {string} friends - Array of user friends.
     * @property {string} friendRequests - Array of user friend requests.
     * @property {string} friendRequestsOwn - Array of friend requests sent by the user.
     * @property {string} guilds - Array of user guilds.
     * @property {string} messages - Array of user messages.
     * @property {string} status - The online status of the user.
     * @property {string} pfpURL - The profile picture URL of the user.
     * @property {number} creationTime - The timestamp of user creation.
     * @property {string} username - The username of the user.
     * @property {string} display_name - The display name of the user.
     * @property {string} email - The email address of the user.
     * @property {string} password - The password of the user.
     */
    constructor() {}

    /**
     * Initialize user with options.
     * @param {Object} options - The options for user initialization.
     * @param {string} options.token - The token for user initialization.
     * @param {string} options.password - The password for user initialization.
     */
    async init(options) {
        if(options.token) {
            await this.initWithToken(options.token);
        } else if(options.password) {
            this.initWithCredentials(options);
        }
    }

    /**
     * Initialize user with token.
     * @param {string} token - The token for user initialization.
     */
    async initWithToken(token) {
        try {
            const userData = await query_search(token, "token");
            if(userData) {
                Object.assign(this, userData);
            }
        } catch (err) {
            console.error("Error fetching user data with token:", err.message);
        }
    }

    /**
     * Initialize user credentials.
     * @param {Object} options - The options for user credentials.
     * @param {string} options.username - The username of the user.
     * @param {string} options.email - The email of the user.
     * @param {string} options.password - The password of the user.
     */
    initWithCredentials(options) {
        this.id = stealth.id_manager.getNextID();
        this.token = options.token || gen_token(this.id);

        this.badges = JSON.stringify([]);
        this.friends = JSON.stringify([]);
        this.friendRequests = JSON.stringify([]);
        this.friendRequestsOwn = JSON.stringify([]);
        this.guilds = JSON.stringify([]);
        this.messages = JSON.stringify([]);
        this.status = "online";
        this.pfpURL = "/mainpage/images/logo_transparent.png";
        this.creationTime = Date.now();
        
        this.username = options.username;
        this.display_name = options.username;
        this.email = options.email;
        this.password = options.password;
    }

    /**
     * Get the value of a property by key.
     * @param {string} key - The key of the property to retrieve.
     * @returns {*} The value of the property.
     */
    get(key) {
        const value = this[key];
        if(typeof value === 'string') {
            if(value.startsWith('{') || value.startsWith('[')) {
                try {
                    return JSON.parse(value);
                } catch (error) {
                    console.error("Failed to parse JSON for key:", key, error);
                    return value;
                }
            }
        }
        return value;
    }

    /**
     * Set the value of a property by key.
     * @param {string} key - The key of the property to set.
     * @param {*} value - The value to set for the property.
     */
    set(key, value) {
        Object.assign(this, { [key]: value });
        let query = `UPDATE users SET ${key} = ? WHERE id = ?`;
        db.run(query, [typeof value === 'object' ? JSON.stringify(value) : value, this.id], function(err) {
            if(err) {
                console.error(`Failed to update user ${this.id}:`, err.message);
            }
        });
    }

    /**
     * Get all properties of the user.
     * @returns {Object} All properties of the user.
     */
    async getAllProperties() {
        const properties = {};

        for (const key in this) {
            if(this.hasOwnProperty(key)) {
                const value = this.get(key);
                properties[key] = value instanceof Promise ? await value : value;
            }
        }

        properties.friends = await fetch_users(JSON.parse(this.friends), true);

        return properties;
    }

    /**
     * Send data to the user's socket.
     * @param {string} type - The type of data to send.
     * @param {...*} data - The data to send.
     * @returns {boolean} True if data is sent successfully, false otherwise.
     */
    send(type, ...data) {
        const socket = this.getSocket();
        if(!socket) return false;

        socket.emit(type, ...data);

        return true;
    }

    getSocket() {
        return stealth.sockets[this.id] || null;
    }

    setStatus(type) {
        this.status = type;
        this.set("status", type);
    }

    save() {
        let query = `INSERT OR REPLACE INTO users (id, token, badges, friends, friendRequests, friendRequestsOwn, guilds, messages, status, pfpURL, creationTime, username, display_name, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        db.run(query, [this.id, this.token, this.badges, this.friends, this.friendRequests, this.friendRequestsOwn, this.guilds, this.messages, this.status, this.pfpURL, this.creationTime, this.username, this.display_name, this.email, this.password], function(err) {
            if(err) {
                console.error("Failed to save user:", err.message);
            }
        });
    }
}

module.exports = { User, query_search, fetch_users, safe_user }