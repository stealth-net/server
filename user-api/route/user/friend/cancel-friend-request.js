const { User, queue_search } = require("../../../../components/User.js");

module.exports = (req, res) => {
    if(!req.cookies.token) {
        res.sendStatus(401);
        return;
    };

    const sender = new User({ token: req.cookies.token });
    const target = new User({ token: queue_search(req.body.username, "username").token });

    if(typeof target == "undefined" || sender.id == target.id) {
        res.sendStatus(400);
        return;
    };

    if(sender.friendRequestsOwn.filter(friendRequest => friendRequest.id === target.id).length === 0) {
        res.sendStatus(403);
        return;
    };

    sender.friendRequestsOwn = sender.friendRequestsOwn.filter(friendRequest => friendRequest.username !== target.username);
    target.friendRequests = target.friendRequests.filter(friendRequest => friendRequest.username !== sender.username);

    target.send("friendRequestCancel", sender.username);

    sender.save();
    target.save();

    res.sendStatus(200);
};