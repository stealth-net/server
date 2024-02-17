const { get_message } = require('./Message.js');

const db = stealth.database;

const query = `
CREATE TABLE IF NOT EXISTS conversations (
    id TEXT PRIMARY KEY,
    participant1 TEXT,
    participant2 TEXT,
)`;
db.run(query, function(err) {
    if(err) {
        log("ERROR", "Failed to create conversations table:", err.message);
    }
});

/**
 * Retrieves a conversation from the database based on the provided ID.
 * @param {string} id - The ID of the conversation to retrieve.
 * @returns {Promise<Object>} A promise that resolves with the conversation data if found, or rejects with an error.
 */
function get_conversation(id) {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM conversations WHERE id = ?`;
        db.get(query, [id], (err, row) => {
            if (err) {
                reject(new Error(`SQLITE_ERROR: no such table: users --> in Database#get('${query}', [ '${id}' ])`));
            } else {
                resolve(row);
            }
        });
    });
}

class Conversation {
    constructor() {
        this.messages = [];
    }

    async addMessage(options) {
        const message = new Message();
        await message.init(options);
        this.messages.push(message.id);
    }

    getMessages() {
        return this.messages.map(id => get_message(id));
    }

    save() {
        let query = `INSERT OR REPLACE INTO conversations (id, participant1, participant2) VALUES (?, ?, ?)`;
        db.run(query, [this.id, this.participant1, this.participant2], function(err) {
            if(err) {
                console.error("Failed to save conversation:", err.message);
            }
        });
    }
}

module.exports = { Conversation, get_conversation };