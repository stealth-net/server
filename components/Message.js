const db = stealth.database;

/**
 * Represents a message in a conversation.
 */
class Message {
    /**
     * Creates an instance of a Message.
     * @param {Object} options - The options to initialize the message.
     * @param {string} options.senderId - The ID of the sender.
     * @param {string} options.recipientId - The ID of the recipient.
     * @param {string} options.content - The content of the message.
     * @param {string} options.conversationId - The ID of the conversation.
     * @param {Array} [options.attachments] - The attachments of the message.
     */
    constructor(options) {
        this.senderId = options.senderId;
        this.recipientId = options.recipientId;
        this.content = options.content;
        this.conversationId = options.conversationId;
        this.attachments = options.attachments || [];
        this.id = stealth.idManager.getNextID();
        this.creationTime = Date.now();
    }

    /**
     * Initializes the message with the provided options.
     * @param {Object} [options={}] - The options to initialize the message.
     * @param {string} [options.id] - The ID of the message.
     * @param {string} [options.senderId] - The ID of the sender.
     * @param {string} [options.recipientId] - The ID of the recipient.
     * @param {string} [options.content] - The content of the message.
     * @param {string} [options.conversationId] - The ID of the conversation.
     * @param {Array} [options.attachments] - The attachments of the message.
     * @returns {Promise<void>}
     * @throws {Error} If the message is not found or invalid options are provided.
     */
    async init(options = {}) {
        if (options.id) {
            const query = `SELECT messages FROM conversations WHERE id = ?`;
            const conversation = await new Promise((resolve, reject) => {
                db.get(query, [this.conversationId], (err, row) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(row);
                    }
                });
            });
            const messages = JSON.parse(conversation.messages);
            const message = messages.find(m => m.id === options.id);
            if (!message) {
                throw new Error("Message not found in conversation");
            }
            this.senderId = message.senderId;
            this.recipientId = message.recipientId;
            this.content = message.content;
            this.attachments = message.attachments || [];
            this.conversationId = options.conversationId;
            this.creationTime = message.creationTime || Date.now();
            this.id = message.id;
        } else if (options.senderId && options.recipientId && options.content) {
            this.senderId = options.senderId;
            this.recipientId = options.recipientId;
            this.content = options.content;
            this.attachments = options.attachments || [];
            this.conversationId = options.conversationId;
            this.creationTime = Date.now();
            this.id = stealth.idManager.getNextID();
        } else {
            throw new Error("Invalid message initialization options");
        }
    }

    /**
     * Saves the current state of the message to the database.
     * @returns {Promise<void>} A promise that resolves when the message is successfully saved.
     */
    async save() {
        const query = `SELECT messages FROM conversations WHERE id = ?`;
        const conversation = await new Promise((resolve, reject) => {
            db.get(query, [this.conversationId], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
        let messages = JSON.parse(conversation.messages);
        messages.push({
            id: this.id,
            senderId: this.senderId,
            recipientId: this.recipientId,
            content: this.content,
            attachments: this.attachments,
            conversationId: this.conversationId,
            creationTime: this.creationTime
        });
        const updateQuery = `UPDATE conversations SET messages = ? WHERE id = ?`;
        return new Promise((resolve, reject) => {
            db.run(updateQuery, [JSON.stringify(messages), this.conversationId], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}

module.exports = { Message };