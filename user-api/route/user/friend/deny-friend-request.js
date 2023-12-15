const { user_search, queue_search, save } = require("../../../../utils/users.js");

module.exports = (req, res) => {
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

    if(sender.friendRequestsOwn.filter(friendRequest => friendRequest.id === targetUser.id).length === 0) {
        res.sendStatus(403);
        return;
    };

    sender.friendRequests = sender.friendRequestsOwn.filter(friendRequest => friendRequest.username !== targetUser.username);
    targetUser.friendRequestsOwn = targetUser.friendRequests.filter(friendRequest => friendRequest.username !== sender.username);

    save(sender);
    save(targetUser);

    res.sendStatus(200);
};