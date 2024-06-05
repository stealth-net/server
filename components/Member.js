const { log } = require("../utils/log.js");
const db = stealth.database;

const query = `
CREATE TABLE IF NOT EXISTS members (
    id TEXT NOT NULL,
    guild_id TEXT NOT NULL,
    roles TEXT,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    owner BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id, guild_id),
    FOREIGN KEY (id) REFERENCES users(id),
    FOREIGN KEY (guild_id) REFERENCES guilds(id)
)`;
db.run(query, function(err) {
    if(err) {
        log("ERROR", "Failed to create members table:", err.message);
    }
});

function get_member(userId, guildId) {
    const query = 'SELECT * FROM members WHERE id = ? AND guild_id = ?';
    return new Promise((resolve, reject) => {
        db.get(query, [userId, guildId], (err, row) => {
            if (err) {
                log("ERROR", "Failed to fetch member data:", err.message);
                reject(err);
            } else if (row) {
                resolve(row);
            } else {
                resolve(null);
            }
        });
    });
}

/**
 * Represents a member of a guild.
 */
class Member {
    /**
     * @property {string} id - The unique identifier for the member.
     * @property {string} guild_id - The unique identifier for the guild.
     * @property {Date} joined_at - The date when the member joined the guild.
     * @property {boolean} owner - Specifies if the member is the owner of the guild.
     */
    constructor() {}

    /**
     * Initializes the member object with provided options.
     * @param {Object} options - The options for initializing the member.
     * @param {boolean} options.new - Specifies if the member is new.
     * @param {string} [options.id] - The member's ID.
     * @param {string} [options.guild_id] - The guild ID of the member.
     * @param {boolean} [options.owner] - Specifies if the member is the owner of the guild.
     * @throws {Error} Throws an error if both user ID and guild ID are not provided for existing members.
     */
    async init(options) {
        if (options.new) {
            this.id = options.id || null;
            this.guild_id = options.guild_id || null;
            this.joined_at = new Date();
            this.roles = "[]";
            this.owner = false;
        } else if (options.id && options.guild_id && !options.new) {
            try {
                const memberData = await this.queryMember(options.id, options.guild_id);
                this.assignMemberData(memberData);
            } catch (err) {
                log("ERROR", "Failed to initialize member with ID and Guild ID:", err.message);
            }
        } else {
            throw new Error("Member initialization requires both user ID and guild ID.");
        }
    }

    /**
     * Queries the database for member data.
     * @param {string} userId - The ID of the user.
     * @param {string} guildId - The ID of the guild.
     * @returns {Promise<Object|null>} A promise that resolves to the member data or null if not found.
     */
    async queryMember(userId, guildId) {
        const query = 'SELECT * FROM members WHERE id = ? AND guild_id = ?';
        return new Promise((resolve, reject) => {
            db.get(query, [userId, guildId], (err, row) => {
                if (err) {
                    log("ERROR", "Failed to fetch member data:", err.message);
                    reject(err);
                } else if (row) {
                    resolve(row);
                } else {
                    resolve(null);
                }
            });
        });
    }

    /**
     * Assigns the fetched data to the member object.
     * @param {Object} memberData - The data to be assigned to the member.
     */
    assignMemberData(memberData) {
        if (memberData) {
            this.id = memberData.id;
            this.guild_id = memberData.guild_id;
            this.roles = memberData.roles;
            this.joined_at = new Date(memberData.joined_at);
            this.owner = memberData.owner;
        }
    }

    /**
     * Asynchronously saves the member data to the database.
     * @returns {Promise<void>} A promise that resolves when the member data is successfully saved.
     */
    async save() {
        const insertQuery = `
            INSERT INTO members (id, guild_id, roles, joined_at, owner) VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(id, guild_id) DO UPDATE SET roles = excluded.roles, joined_at = excluded.joined_at, owner = excluded.owner
        `;
        return new Promise((resolve, reject) => {
            db.run(insertQuery, [this.id, this.guild_id, this.roles, this.joined_at, this.owner], function(err) {
                if(err) {
                    log("ERROR", "Failed to save member to database:", err.message);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}

module.exports = { Member, get_member };