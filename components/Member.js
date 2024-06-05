const { log } = require("../utils/log.js");
const db = stealth.database;

const query = `
CREATE TABLE IF NOT EXISTS members (
    id TEXT PRIMARY KEY,
    guild_id TEXT NOT NULL,
    roles TEXT,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(id, guild_id),
    FOREIGN KEY (id) REFERENCES users(id),
    FOREIGN KEY (guild_id) REFERENCES guilds(id)
)`;
db.run(query, function(err) {
    if(err) {
        log("ERROR", "Failed to create members table:", err.message);
    }
});

class Member {
    constructor(id, guild_id) {
        this.id = id;
        this.guild_id = guild_id;
        this.joined_at = new Date();
    }

    async save() {
        const insertQuery = `
            INSERT INTO members (id, guild_id, joined_at)
            VALUES (?, ?, ?)
            ON CONFLICT(id, guild_id) DO UPDATE SET
            joined_at = excluded.joined_at
        `;
        return new Promise((resolve, reject) => {
            db.run(insertQuery, [this.id, this.guild_id, this.joined_at.toISOString()], function(err) {
                if(err) {
                    log("ERROR", "Failed to save member to database:", err.message);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    static async fetch(id, guild_id) {
        const query = `SELECT * FROM members WHERE id = ? AND guild_id = ?`;
        return new Promise((resolve, reject) => {
            db.get(query, [id, guild_id], (err, row) => {
                if(err) {
                    log("ERROR", "Failed to fetch member from database:", err.message);
                    reject(err);
                } else if (row) {
                    const member = new Member(row.id, row.guild_id, row.role);
                    member.joined_at = new Date(row.joined_at);
                    resolve(member);
                } else {
                    resolve(null);
                }
            });
        });
    }
}

module.exports = Member;