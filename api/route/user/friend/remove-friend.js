const { User, queue_search } = require("../../../../components/User.js");

function post(req, res) {
    if(!req.cookies.token) {
        res.sendStatus(401);
        return;
    };

    const sender = new User({ token: req.cookies.token });
    const target = new User({ token: queue_search(req.body.id, "id").token });

    if(!sender.friends.includes(target.id)) {
        res.sendStatus(403);
        return;
    };

    sender.friends = sender.friendRequestsOwn.filter(id => id !== target.id);
    target.friends = target.friendRequests.filter(id => id !== sender.id);

    target.send("friendRemove", sender.id);

    sender.save();
    target.save();

    res.send();
};

module.exports = post;