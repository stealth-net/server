const User = require("./User.js");
const { user_search } = require("../utils/users.js");

class Message {
    constructor(author, content) {
        this.id = stealth.id_manager.getNextID();
        this.content = content;

        if(author instanceof User) {
            this.author = author;
        } else if(!isNaN(author)) { // user id given
            this.author = user_search(author);
        };
    };
};

module.exports = Message;