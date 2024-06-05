const { log } = require("../utils/log.js");

const { User } = require("./User.js");
const { Member } = require("./Member.js");

const db = stealth.database;

const query = `
CREATE TABLE IF NOT EXISTS guilds (
    id TEXT PRIMARY KEY,
    name TEXT DEFAULT "New guild",
    ownerID TEXT,
    channels TEXT DEFAULT "[]",
    roles TEXT DEFAULT "[]",
    members TEXT DEFAULT "[]",
    maxMembers INTEGER DEFAULT 16,
    creationTime INTEGER,
    pfpURL TEXT DEFAULT "/mainpage/images/logo_transparent.png",
    invitations TEXT DEFAULT "[]",
    FOREIGN KEY(ownerID) REFERENCES users(id)
)`;
db.run(query, function(err) {
    if(err) {
        log("ERROR", "Failed to create guilds table:", err.message);
    }
});

/**
 * Represents a guild in the system.
 */
class Guild {
    /**
     * @property {string} id - The ID of the guild.
     * @property {string} name - The name of the guild.
     * @property {string} ownerID - The ID of the owner of the guild.
     * @property {string} channels - The channels in the guild.
     * @property {string} roles - The roles in the guild.
     * @property {string} members - The members in the guild.
     * @property {number} maxMembers - The maximum number of members in the guild.
     * @property {number} creationTime - The time the guild was created.
     * @property {string} pfpURL - The URL of the guild's profile picture.
     * @property {string} invitations - The invitations to the guild.
     */
    constructor() {}

    /**
     * Initialize a guild with options.
     * @param {Object} options - The options for initialization.
     * @param {string} options.id - The ID of the guild.
     * @param {string} options.ownerID - The ID of the owner of the guild.
     * @param {string} options.name - The name of the guild to create a new one with.
     */
    async init(options) {
        if (options.id) {
            await this.initWithID(options.id);
        } else if (options.ownerID) {
            await this.initWithOwnerID(options.ownerID);
        } else if (options.name) {
            await this.initWithName(options.name);
        } else {
            throw new Error("Invalid guild initialization options");
        }
    }

    /**
     * Load a guild with the given ID.
     * @param {string} id - The ID of the guild.
     */
    async initWithID(id) {
        try {
            const guildData = await this.querySearch(id, "id");
            this.assignGuildData(guildData);
        } catch (err) {
            log("ERROR", "Failed to fetch guild data with ID:", err.message);
        }
    }

    /**
     * Load a guild with the given owner ID.
     * @param {string} ownerID - The ID of the owner.
     */
    async initWithOwnerID(ownerID) {
        try {
            const guildData = await this.querySearch(ownerID, "ownerID");
            this.assignGuildData(guildData);
        } catch (err) {
            log("ERROR", "Failed to fetch guild data with owner ID:", err.message);
        }
    }

    /**
     * Create a new guild with the given name.
     * @param {string} name - The name of the guild.
     */
    async initWithName(name) {
        this.id = stealth.id_manager.getNextID();
        this.name = name;
        this.ownerID = null; // Owner to be assigned later
        this.maxMembers = 16;
        this.members = "[]";
        this.channels = "[]";
        this.roles = "[]";
        this.invitations = "[]";
        this.pfpURL = '/mainpage/images/logo_transparent.png';
        this.creationTime = Date.now();
    }

    /**
     * Assign guild data if available.
     * @param {Object|null} guildData - The guild data to assign.
     */
    assignGuildData(guildData) {
        if (guildData) {
            Object.assign(this, guildData);
        }
    }

    /**
     * Searches for a guild in the database based on a specific key.
     * @param {string} queue - The value to search for in the database.
     * @param {string} key - The key to search for in the database.
     * @returns {Promise<Object>} A promise that resolves with the guild row if found, or rejects with an error.
     */
    async querySearch(queue, key) {
        return new Promise((resolve, reject) => {
            let query = `SELECT * FROM guilds WHERE ${key} = ?`;
            db.get(query, [queue], (err, row) => {
                if (err) {
                    reject(new Error(`SQLITE_ERROR: no such table: guilds --> in Database#get('${query}', [ '${queue}' ])`));
                } else {
                    resolve(row);
                }
            });
        });
    }

    /**
     * Get the value of a property by key.
     * @param {string} key - The key of the property to retrieve.
     * @returns {*} The value of the property.
    */
    get(key) {
        const value = this[key];
        if(typeof value === "string") {
            if(value.startsWith("{") || value.startsWith("[")) {
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
        let query = `UPDATE guilds SET ${key} = ? WHERE id = ?`;
        db.run(query, [typeof value === "object" ? JSON.stringify(value) : value, this.id], function(err) {
            if(err) {
                console.error(`Failed to update user ${this.id}:`, err.message);
            }
        });
    }
    
    /**
     * Adds a guild to the user's list of guilds and updates the guild's member list.
     * @param {string} userID - The ID of the user to add to the guild.
     * @returns {Promise<Member>} A promise that resolves with the member object.
     */
    async addMember(userID, options = {}) {
        const members = this.get("members") || [];
        if (!members.includes(userID)) {
            members.push(userID);
            this.set("members", JSON.stringify(members));
        }

        const user = new User();
        await user.initWithID(userID);
        const oldGuilds = user.get("guilds");
        user.set("guilds", [...oldGuilds, this.id]);

        const member = new Member();
        await member.init({ id: userID, guild_id: this.id, new: true, owner: options.owner });
        await member.save();

        return member;
    }
    
    /**
     * Removes a member from the guild.
     * @param {string} userID - The ID of the user to remove from the guild.
     */
    removeMember(userID) {
        if(!this.get("members").includes(userID)) return;
        const members = this.get("members").filter(id => id !== userID);
        this.set("members", members);

        const user = new User();
        user.initWithID(userID);

        user.send("guildRemoved", this.id);
    }

    /**
     * Sets a new owner for the guild and updates the owner status in the database.
     * @param {string} userID - The ID of the new owner.
     */
    async setOwner(userID) {
        this.set("ownerID", userID);

        const member = new Member();
        await member.init({ id: userID, guild_id: this.id });
        member.owner = true;
        await member.save();
    }

    /**
     * Asynchronously saves the guild data to the database.
     * @returns {Promise<void>} A promise that resolves when the guild data is successfully saved.
     */
    async save() {
        const query = `INSERT INTO guilds (id, name, ownerID, channels, roles, members, maxMembers, creationTime, pfpURL, invitations) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        return new Promise((resolve, reject) => {
            db.run(query, [this.id, this.name, this.ownerID, this.channels, this.roles, this.members, this.maxMembers, this.creationTime, this.pfpURL, this.invitations], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}

module.exports = Guild;