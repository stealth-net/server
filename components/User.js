const gen_token = require("../utils/gen_token.js");
const { queue_search, save } = require("../utils/users.js");

class User {
    constructor(options = {}) {
        if(options.token) {
            const userData = queue_search(options.token, "token");
            
            for(let key in userData) {
                this[key] = userData[key];
            };
        } else if(!options.token && options.username && options.email && options.password) {
            this.id = stealth.id_manager.getNextID();
            this.token = options.token || gen_token(this.id);

            this.badges = [];
            this.friends = [];
            this.friendRequests = [];
            this.friendRequestsOwn = [];
            this.guilds = [];
            this.status = "online";
            this.pfpURL = "/mainpage/images/logo_transparent.png";
            this.creationTime = Date.now();
            
            this.username = options.username;
            this.email = options.email;
            this.password = options.password;
            
            this.save();
        };
    };
    save() {
        save(this);
    };
};

module.exports = User;