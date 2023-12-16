const { User, queue_search } = require("../../../../components/User.js");

module.exports = (req, res) => {
    if(!req.cookies.token) {
        res.sendStatus(401);
        return;
    };

    const sender = new User({ token: req.cookies.token });
    const target = new User({ token: queue_search(req.body.username, "username").token });

    if(typeof target == "undefined" || sender.id == target.id) {
        res.sendStatus(404);
        return;
    };

    if(sender.friends.includes(target.username) ||
        sender.friendRequestsOwn.filter(friendRequest => friendRequest.id === sender.id).length > 0 ||
        sender.friendRequests.filter(friendRequest => friendRequest.id === sender.id).length > 0
    ) {
        res.sendStatus(409);
        return;
    };

    sender.friendRequestsOwn.push({ username: target.username, pfpURL: target.pfpURL, id: target.id });
    target.friendRequests.push({ username: sender.username, pfpURL: sender.pfpURL, id: sender.id });

    target.send("friendRequest", { username: sender.username, pfpURL: sender.pfpURL, id: sender.id });

    sender.save();
    target.save();

    res.send(target);
};