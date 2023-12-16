const { queue_search } = require("./User.js");

class Badge {
    constructor(options) {
        this.name = options.name;
        this.url = options.url;
    };
};

let I = 1;

const Badges = {
    "Developer badge": {
        id: I++,
        name: "Developer badge"
    }
};

function promote_badge(queue, badgeID) {
    const user = queue_search(queue);

    if(user.badges.indexOf(badgeID) === -1)
        user.badges.push(badgeID);

    save(user);
};

function demote_badge(queue, badgeID) {
    const user = queue_search(queue);

    user.badges = user.badges.filter(badge => badge.id !== badgeID);

    save(user);
};

module.exports = {
    promote_badge,
    demote_badge,
    Badges
};