const { queue_search, save } = require("../../../../utils/users.js");

function post(req, res) {
    if(!req.cookies.token) {
        res.sendStatus(401);
        return;
    };

    const sender = new User({ token: req.cookies.token });
    const target = queue_search(req.body.username, "username");

    if(!sender.friends.includes(target.username)) {
        res.sendStatus(403);
        return;
    };

    sender.friends = sender.friendRequestsOwn.filter(friendRequest => friendRequest.id !== target.id);
    target.friends = target.friendRequests.filter(friendRequest => friendRequest.id !== sender.id);

    save(sender);
    save(target);

    res.send(target);
};

module.exports = post;