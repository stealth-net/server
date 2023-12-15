const { queue_search, save } = require("../../../../utils/users.js");

module.exports = (req, res) => {
    if(!req.cookies.token) {
        res.sendStatus(401);
        return;
    };

    const sender = queue_search(req.cookies.token, "token");
    const targetUser = queue_search(req.body.username, "username");

    if(typeof targetUser == "undefined" || sender.id == targetUser.id) {
        res.sendStatus(404);
        return;
    };

    if(sender.friends.includes(targetUser.username) ||
        sender.friendRequestsOwn.filter(friendRequest => friendRequest.id === sender.id).length > 0 ||
        sender.friendRequests.filter(friendRequest => friendRequest.id === sender.id).length > 0
    ) {
        res.sendStatus(409);
        return;
    };

    sender.friendRequestsOwn.push({ username: targetUser.username, pfpURL: targetUser.pfpURL, id: targetUser.id });
    targetUser.friendRequests.push({ username: sender.username, pfpURL: sender.pfpURL, id: sender.id });

    save(sender);
    save(targetUser);

    res.send(targetUser);
};