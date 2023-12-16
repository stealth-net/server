const User = require("./User.js");
const { queue_search } = require("./User.js");

class Message {
    constructor(author, content) {
        this.id = stealth.id_manager.getNextID();
        this.content = content;

        if(author instanceof User) {
            this.author = author;
        } else if(!isNaN(author)) { // user id given
            this.author = queue_search(author);
        };
    };
};

module.exports = Message;