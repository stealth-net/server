const { queue_search, save } = require("../../../../utils/users.js");

module.exports = (req, res) => {
    if(!req.cookies.token) {
        res.sendStatus(401);
        return;
    };

    const sender = new User({ token: req.cookies.token });
    const target = queue_search(req.body.username, "username");

    if(typeof target == "undefined" || sender.id == target.id) {
        res.sendStatus(400);
        return;
    };

    if(sender.friends.includes(target.username) ||
    sender.friendRequestsOwn.filter(friendRequest => friendRequest.id === sender.id).length > 0 ||
    sender.friendRequests.filter(friendRequest => friendRequest.id === sender.id).length > 0
    ) {
        res.sendStatus(409);
        return;
    };

    sender.friendRequests = sender.friendRequestsOwn.filter(friendRequest => friendRequest.id !== target.id);
    target.friendRequestsOwn = target.friendRequests.filter(friendRequest => friendRequest.id !== sender.id);

    sender.friends.push(target.username);
    target.friends.push(sender.username);

    save(sender);
    save(target);

    res.sendStatus(200);
};