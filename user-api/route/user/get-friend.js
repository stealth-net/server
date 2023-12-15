const { queue_search } = require("../../../utils/users.js");

function post(req, res) {
    if(!req.cookies.token) {
        res.sendStatus(401);
        return;
    };

    const user = queue_search(req.cookies.token, "token");
    const targetUser = queue_search(req.body.username, "username");

    if(user.friends.filter(friendUsername => {
        const friendData = queue_search(friendUsername, "username");
        return friendData.id === targetUser.id;
    }).length === 0) {
        res.sendStatus(400);
        return;
    };

    res.send({
        username: targetUser.username,
        pfpURL: targetUser.pfpURL,
        status: targetUser.status
    });
};

module.exports = post;