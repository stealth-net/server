const sanitize_xss = require("../utils/sanitize_xss.js");
const database = stealth.database.messages;

function query_search(queue, key) {
    const messageIds = Object.keys(database.data);
    
    var result = null;

    messageIds.forEach(ID => {
        const value = database.getValue(ID, key);

        if(value == queue)
            result = database.getValue(ID);
    });

    return result;
}

class Message {
    constructor(options = {}) { // author, receiver, content
        if(options.author && options.receiver && options.content) {
            this.id = stealth.id_manager.getNextID();
            this.author = options.author;
            this.receiver = options.receiver;
            this.content = sanitize_xss(options.content);
        } else if(options.id) {
            const messageData = query_search(options.id, "id");
            
            for(let key in messageData) {
                this[key] = messageData[key];
            }
        }
    }
    save() {
        database.data[this.id] = class_to_json(this);
        database.save();
    }
}

module.exports = Message;