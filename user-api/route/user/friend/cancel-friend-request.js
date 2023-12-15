const { queue_search, save } = require("../../../../utils/users.js");

module.exports = (req, res) => {
    if(!req.cookies.token) {
        res.sendStatus(401);
        return;
    };

    const sender = queue_search(req.cookies.token, "token");
    const targetUser = queue_search(req.body.username, "username");

    if(typeof targetUser == "undefined" || sender.id == targetUser.id) {
        res.sendStatus(400);
        return;
    };

    if(sender.friendRequestsOwn.filter(friendRequest => friendRequest.id === targetUser.id).length === 0) {
        res.sendStatus(403);
        return;
    };

    sender.friendRequestsOwn = sender.friendRequestsOwn.filter(friendRequest => friendRequest.username !== targetUser.username);
    targetUser.friendRequests = targetUser.friendRequests.filter(friendRequest => friendRequest.username !== sender.username);

    save(sender);
    save(targetUser);

    res.sendStatus(200);
};