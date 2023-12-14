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

    sender.friendRequestsOwn.push({ username: targetUser.username, pfpURL: targetUser.pfpURL });
    targetUser.friendRequests.push({ username: sender.username, pfpURL: sender.pfpURL });

    save(sender);
    save(targetUser);

    res.send(targetUser);
};