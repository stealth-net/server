const { queue_search } = require("../../../utils/users.js");

function post(req, res) {
    if(!req.cookies.token) {
        res.sendStatus(401);
        return;
    };

    const user = queue_search(req.cookies.token, "token");

    if(user.friends.indexOf(req.body.id) === -1) {
        res.sendStatus(403);
        return;
    };

    const targetUser = queue_search(req.body.id, "id");

    res.send({
        username: targetUser.username,
        pfpURL: targetUser.pfpURL,
        status: targetUser.status
    });
};

module.exports = post;