const log = require('../utils/log.js');
const db = stealth.database;

const query = `
CREATE TABLE IF NOT EXISTS conversations (
    id TEXT PRIMARY KEY,
    messages TEXT
)`;
db.run(query, function(err) {
    if(err) {
        log("ERROR", "Failed to create conversations table:", err.message);
    }
});

/**
 * Generates a conversation ID based on the provided sender and recipient IDs.
 * @param {string} senderId - The ID of the sender.
 * @param {string} recipientId - The ID of the recipient.
 * @returns {string} The generated conversation ID.
*/
function get_conversation_id(senderId, recipientId) {
    return [senderId, recipientId].sort((a, b) => b.localeCompare(a)).join("-");
}

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
                reject(new Error(`SQLITE_ERROR: no such table: conversations --> in Database#get('${query}', [ '${id}' ])`));
            } else {
                if (row) {
                    row.messages = JSON.parse(row.messages || '[]');
                }
                resolve(row);
            }
        });
    });
}

/**
 * Represents a conversation between two users.
*/
class Conversation {
    /**
     * Creates an instance of a Conversation.
     * @param {string} senderId - The ID of the sender.
     * @param {string} recipientId - The ID of the recipient.
    */
    constructor(senderId, recipientId) {
        this.id = get_conversation_id(senderId, recipientId);
        this.messages = JSON.stringify([]);
    }

    /**
     * Adds a message to the conversation.
     * @param {Object} message - The message to add.
    */
    addMessage(message) {
        const messages = JSON.parse(this.messages);
        messages.push(message);
        this.messages = JSON.stringify(messages);
        this.save();
    }

    /**
     * Saves the current state of the conversation to the database.
     * @returns {Promise<void>} A promise that resolves when the conversation is successfully saved.
    */
    async save() {
        const query = `INSERT OR REPLACE INTO conversations (id, messages) VALUES (?, ?)`;
        return new Promise((resolve, reject) => {
            db.run(query, [this.id, this.messages], function(err) {
                if(err) {
                    reject(new Error("Failed to save conversation: " + err.message));
                } else {
                    resolve();
                }
            });
        });
    }
}

module.exports = { Conversation, get_conversation, get_conversation_id };