const { User, query_search } = require("./User.js");

let I = 0;

const Badges = {
    "Developer": {
        id: I++,
        name: "Developer",
        icon: ""
    }
}

async function promoteBadge(queue, badgeID) {
    const userProperties = await query_search(queue, "id");
    const user = new User();
    await user.initWithToken(userProperties.token);

    let badges = user.get("badges");
    if(!badges.includes(badgeID)) {
        badges.push(badgeID);
        user.set("badges", badges);
    }
}

async function demoteBadge(queue, badgeID) {
    const userProperties = await query_search(queue, "id");
    const user = new User();
    await user.initWithToken(userProperties.token);

    let badges = user.get("badges");
    badges = badges.filter(badge => badge !== badgeID);
    user.set("badges", badges);
}

function getBadge(badgeName) {
    return Object.values(Badges).find(badge => badge.name === badgeName);
}

module.exports = {
    promoteBadge,
    demoteBadge,
    Badges,
    getBadge
}