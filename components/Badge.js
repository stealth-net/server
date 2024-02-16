const { User, query_search } = require("./User.js");

class Badge {
    constructor(options) {
        this.name = options.name;
        this.url = options.url;
    }
}

let I = 1;

const Badges = {
    "Developer badge": {
        id: I++,
        name: "Developer"
    }
}

async function promote_badge(queue, badgeID) {
    const userProperties = await query_search(queue, "id");
    const user = new User();
    await user.initWithToken(userProperties.token);

    let badges = user.get('badges');
    if(!badges.includes(badgeID)) {
        badges.push(badgeID);
        user.set('badges', badges);
    }
}

async function demote_badge(queue, badgeID) {
    const userProperties = await query_search(queue, "id");
    const user = new User();
    await user.initWithToken(userProperties.token);

    let badges = user.get('badges');
    badges = badges.filter(badge => badge !== badgeID);
    user.set('badges', badges);
}

module.exports = {
    promote_badge,
    demote_badge,
    Badges
}