const { user_search, queue_search, save } = require("../../../../utils/users.js");

function post(req, res) {
    if(!req.cookies.token) {
        res.sendStatus(401);
        return;
    };

    const sender = queue_search(req.cookies.token, "token");
    const targetUser = user_search(req.body.username);

    if(typeof targetUser == "undefined" || sender.id == targetUser.id) {
        res.sendStatus(400);
        return;
    };

    sender.friends = sender.friendRequestsOwn.filter(friendRequest => friendRequest.id !== targetUser.id);
    targetUser.friends = targetUser.friendRequests.filter(friendRequest => friendRequest.id !== sender.id);

    save(sender);
    save(targetUser);

    res.send(targetUser);
};

module.exports = post;