const { log } = require("../utils/log.js");
const db = stealth.database;

const query = `
CREATE TABLE IF NOT EXISTS members (
    id TEXT NOT NULL,
    guildId TEXT NOT NULL,
    roles TEXT,
    joinedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    owner BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id, guildId),
    FOREIGN KEY (id) REFERENCES users(id),
    FOREIGN KEY (guildId) REFERENCES guilds(id)
)`;
db.run(query, function(err) {
    if(err) {
        log("ERROR", "Failed to create members table:", err.message);
    }
});

function getMember(userId, guildId) {
    const query = 'SELECT * FROM members WHERE id = ? AND guildId = ?';
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
     * @property {string} guildId - The unique identifier for the guild.
     * @property {Date} joinedAt - The date when the member joined the guild.
     * @property {boolean} owner - Specifies if the member is the owner of the guild.
     */
    constructor() {}

    /**
     * Initializes the member object with provided options.
     * @param {Object} options - The options for initializing the member.
     * @param {boolean} options.new - Specifies if the member is new.
     * @param {string} [options.id] - The member's ID.
     * @param {string} [options.guildId] - The guild ID of the member.
     * @param {boolean} [options.owner] - Specifies if the member is the owner of the guild.
     * @throws {Error} Throws an error if both user ID and guild ID are not provided for existing members.
     */
    async init(options) {
        if (options.new) {
            this.id = options.id || null;
            this.guildId = options.guildId || null;
            this.joinedAt = new Date();
            this.roles = "[]";
            this.owner = false;
        } else if (options.id && options.guildId && !options.new) {
            try {
                const memberData = await this.queryMember(options.id, options.guildId);
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
        const query = 'SELECT * FROM members WHERE id = ? AND guildId = ?';
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
            this.guildId = memberData.guildId;
            this.roles = memberData.roles;
            this.joinedAt = new Date(memberData.joinedAt);
            this.owner = memberData.owner;
        }
    }

    /**
     * Asynchronously saves the member data to the database.
     * @returns {Promise<void>} A promise that resolves when the member data is successfully saved.
     */
    async save() {
        const insertQuery = `
            INSERT INTO members (id, guildId, roles, joinedAt, owner) VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(id, guildId) DO UPDATE SET roles = excluded.roles, joinedAt = excluded.joinedAt, owner = excluded.owner
        `;
        return new Promise((resolve, reject) => {
            db.run(insertQuery, [this.id, this.guildId, this.roles, this.joinedAt, this.owner], function(err) {
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

module.exports = { Member, getMember };