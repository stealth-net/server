const { log } = require('../utils/log.js');
const db = stealth.database;

const query = `
CREATE TABLE IF NOT EXISTS guilds (
    id TEXT PRIMARY KEY,
    name TEXT,
    ownerID TEXT,
    FOREIGN KEY(ownerID) REFERENCES users(id),
    channels TEXT,
    roles TEXT,
    members TEXT,
    maxMembers INTEGER,
    creationTime INTEGER,
    pfpURL TEXT,
    invitations TEXT
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
     * Initialize a new guild with the given creator ID.
     * @param {string} creatorID - The ID of the creator.
     */
    async init(creatorID) {
        try {
            const existingGuild = await this.initWithCreatorID(creatorID);
            if (existingGuild) {
                Object.assign(this, existingGuild);
            } else {
                await this.initGuild();
            }
        } catch (error) {
            log("ERROR", "Failed to initialize guild:", error.message);
        }
    }

    /**
     * Load a guild with the given creator ID.
     * @param {string} creatorID - The ID of the creator.
     */
    async initWithCreatorID(creatorID) {
        const query = `SELECT * FROM guilds WHERE ownerID = ?`;
        return new Promise((resolve, reject) => {
            db.get(query, [creatorID], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    async initGuild(creatorID) {
        this.id = stealth.id_manager.getNextID();
        this.name = "New guild";
        this.ownerID = creatorID;
        this.channels = JSON.stringify([]);
        this.roles = JSON.stringify([]);
        this.members = JSON.stringify([]);
        this.maxMembers = 16;
        this.creationTime = Date.now();
        this.pfpURL = "/mainpage/images/logo_transparent.png";
        this.invitations = JSON.stringify([]);

        const insertQuery = `
            INSERT INTO guilds (id, name, ownerID, channels, roles, members, maxMembers, creationTime, pfpURL, invitations)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        db.run(insertQuery, [this.id, this.name, this.ownerID, this.channels, this.roles, this.members, this.maxMembers, this.creationTime, this.pfpURL, this.invitations], function(err) {
            if (err) {
                log("ERROR", "Failed to create new guild in database:", err.message);
            }
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
}

module.exports = Guild;