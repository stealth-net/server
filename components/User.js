const gen_token = require("../utils/gen_token");

class User {
    constructor(username, email, password) {
        this.id = stealth.id_manager.getNextID();
        this.token = gen_token(this.id);
        this.badges = [];
        this.friends = [];
        this.friendRequests = [];
        this.friendRequestsOwn = [];
        this.guilds = [];
        this.status = "online";
        this.pfpURL = "/mainpage/images/logo_transparent.png";
        this.creationTime = Date.now();
        this.username = username;
        this.email = email;
        this.password = password;
    };
};

module.exports = User;