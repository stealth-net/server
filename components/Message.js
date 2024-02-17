const db = stealth.database;

const query = `
CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    sender TEXT,
    receiver TEXT,
    content TEXT,
    timestamp INTEGER
)`;
db.run(query, function(err) {
    if(err) {
        log("ERROR", "Failed to create messages table:", err.message);
    }
});

/**
 * Retrieves a message from the database based on the provided ID.
 * @param {string} id - The ID of the message to retrieve.
 * @returns {Promise<Object>} A promise that resolves with the message data if found, or rejects with an error.
 */
function get_message(id) {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM messages WHERE id = ?`;
        db.get(query, [id], (err, row) => {
            if (err) {
                reject(new Error(`SQLITE_ERROR: no such table: users --> in Database#get('${query}', [ '${id}' ])`));
            } else {
                resolve(row);
            }
        });
    });
}

class Message {
    constructor() {}

    async init(options = {}) {
        if(options.author && options.receiver && options.content) {
            this.id = stealth.id_manager.getNextID();
            this.author = options.author;
            this.receiver = options.receiver;
            this.content = options.content;
        } else if(options.id) {
            await this.initWithID(options.id);
        }
    }

    /**
     * Initialize message with ID.
     * @param {string} id - The ID for message initialization.
     */
    async initWithID(id) {
        try {
            const messageData = await get_message(id);
            if(messageData) {
                Object.assign(this, messageData);
            }
        } catch (err) {
            console.error("Error fetching message data with id:", err.message);
        }
    }

    /**
     * Initialize message with data.
     * @param {object} data - The data for message initialization.
     * @property {number} author - The author of the message.
     * @property {number} receiver - The receiver of the message.
     * @property {string} content - The content of the message.
     */
    initWithData(data) {
        this.id = stealth.id_manager.getNextID();
        for(let key in data) {
            this[key] = data[key];
        }
    }

    save() {
        let query = `INSERT OR REPLACE INTO messages (id, author, receiver, content) VALUES (?, ?, ?, ?)`;
        db.run(query, [this.id, this.author, this.receiver, this.content], function(err) {
            if(err) {
                console.error("Failed to save message:", err.message);
            }
        });
    }
}

module.exports = { Message, get_message };