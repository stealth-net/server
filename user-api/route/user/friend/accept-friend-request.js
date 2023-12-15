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

    if(sender.friends.filter(friendRequest => friendRequest.username == targetUser.username).length > 0)
        return;
    if(sender.friendRequestsOwn.filter(friendRequest => friendRequest.username == targetUser.username).length !== 0)
        return;
    if(targetUser.friendRequests.filter(friendRequest => friendRequest.username == sender.username).length !== 0)
        return;

    sender.friendRequestsOwn = sender.friendRequestsOwn.filter(friendRequest => friendRequest.username !== targetUser.username);
    targetUser.friendRequests = targetUser.friendRequests.filter(friendRequest => friendRequest.username !== sender.username);

    console.log(sender.friendRequestsOwn, targetUser.friendRequestsOwn);

    sender.friends.push(targetUser.username);
    targetUser.friends.push(sender.username);

    save(sender);
    save(targetUser);

    res.sendStatus(200);
};