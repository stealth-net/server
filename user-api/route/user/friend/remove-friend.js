const { User, queue_search } = require("../../../../components/User.js");

function post(req, res) {
    if(!req.cookies.token) {
        res.sendStatus(401);
        return;
    };

    const sender = new User({ token: req.cookies.token });
    const target = new User({ token: queue_search(req.body.username, "username").token });

    if(!sender.friends.includes(target.username)) {
        res.sendStatus(403);
        return;
    };

    sender.friends = sender.friendRequestsOwn.filter(friendRequest => friendRequest.id !== target.id);
    target.friends = target.friendRequests.filter(friendRequest => friendRequest.id !== sender.id);

    target.send("friendRemove", sender.username);

    sender.save();
    target.save();

    res.send();
};

module.exports = post;