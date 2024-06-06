const db = stealth.database;

class Message {
    constructor(options) {
        this.senderId = options.senderId;
        this.recipientId = options.recipientId;
        this.content = options.content;
        this.conversationId = options.conversationId;
        this.attachments = options.attachments || [];
        this.id = stealth.idManager.getNextID();
        this.creationTime = Date.now();
    }

    async init(options = {}) {
        if(options.id) {
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
        } else if(options.senderId && options.recipientId && options.content) {
            this.senderId = options.senderId;
            this.recipientId = options.recipientId;
            this.content = options.content;
            this.attachments = options.attachments || [];
            this.conversationId = options.conversationId;
            this.creationTime = Date.now();
        } else {
            throw new Error("Invalid message initialization options");
        }
    }

    async save() {
        const query = `SELECT messages FROM conversations WHERE id = ?`;
        const conversation = await new Promise((resolve, reject) => {
            db.get(query, [this.conversationId], (err, row) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
        let messages = JSON.parse(conversation.messages);
        messages.push({
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
                if(err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}

module.exports = { Message };