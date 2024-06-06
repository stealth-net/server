const { log } = require("../utils/log.js");
const Guild = require('./Guild.js');
const db = stealth.database;

const query = `
CREATE TABLE IF NOT EXISTS invites (
    guild_id INT NOT NULL,
    code VARCHAR(255) NOT NULL,
    expiresAt TIMESTAMP NOT NULL,
    PRIMARY KEY (guild_id, code)
)`;
db.run(query, function(err) {
    if (err) {
        log("ERROR", "Failed to create invites table:", err);
    }
});

/**
 * Searches for an invite in the database based on a specific key.
 * @param {string} queue - The value to search for in the database.
 * @param {string} key - The key to search for in the database.
 * @returns {Promise<Object>} A promise that resolves with the invite row if found, or rejects with an error.
 */
async function querySearch(queue, key) {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM invites WHERE ${key} = ?`;
        db.get(query, [queue], (err, row) => {
            if (err) {
                reject(new Error(`SQLITE_ERROR: no such table: invites --> in Database#get('${query}', [ '${queue}' ])`));
            } else {
                resolve(row);
            }
        });
    });
}

/**
 * Generates a random invite code.
 * @returns {string} A random invite code.
 */
function generateCode() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Represents an invite to join the server.
 */
class Invite {
    /**
     * @property {string} code - The code of the invite.
     * @property {string} guild_id - The ID of the guild the invite is for.
     * @property {string} expiresAt - The expiration date of the invite.
     */
    constructor() {}

    /**
     * Initialize an invite with options.
     * @param {Object} options - The options for initialization.
     * @param {string} options.code - The code of the invite.
     * @param {string} options.guildID - The ID of the guild the invite is for.
     */
    async init(options) {
        if (options.code) {
            await this.initWithCode(options.code);
        } else if (options.guildID) {
            await this.initWithGuildID(options.guildID);
        } else {
            throw new Error("Invalid invite initialization options");
        }
    }

    /**
     * Load an invite with the given code.
     * @param {string} code - The code of the invite.
     */
    async initWithCode(code) {
        try {
            const inviteData = await querySearch(code, "code");
            this.assignInviteData(inviteData);
        } catch (err) {
            log.error("Failed to fetch invite data with code:", err);
        }
    }

    /**
     * Initialize an invite with a specific guild ID.
     * @param {string} guildID - The ID of the guild the invite is for.
     */
    async initWithGuildID(guildID) {
        this.guild_id = guildID;
        this.code = generateCode();
        this.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours from now
    }

    /**
     * Assign invite data if available.
     * @param {Object|null} inviteData - The invite data to assign.
     */
    assignInviteData(inviteData) {
        if (inviteData) {
            Object.assign(this, inviteData);
        }
    }

    /**
     * Check if the invite is expired.
     * @returns {boolean} - Returns true if the invite is expired, false otherwise.
     */
    isExpired() {
        return this.expiresAt < new Date();
    }

    /**
     * Get the guild associated with the invite.
     * @returns {Promise<Guild>} A promise that resolves with the guild instance.
     */
    async getGuild() {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM guilds WHERE id = ?`;
            db.get(query, [this.guild_id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    const guild = new Guild();
                    guild.assignGuildData(row);
                    resolve(guild);
                }
            });
        });
    }

    /**
     * Asynchronously saves the invite data to the database.
     * @returns {Promise<void>} A promise that resolves when the invite data is successfully saved.
     */
    async save() {
        const query = `INSERT INTO invites (code, expiresAt) VALUES (?, ?)`;
        return new Promise((resolve, reject) => {
            db.run(query, [this.code, this.expiresAt], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}

module.exports = Invite;