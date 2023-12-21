const { User, queue_search } = require("../../../../components/User.js");

module.exports = async (req, res) => {
    if(!req.cookies.token) {
        res.sendStatus(401);
        return;
    };

    const sender = new User({ token: req.cookies.token });
    const target = new User({ token: await queue_search(req.body.id, "id").token });

    if(typeof target == "undefined" || sender.id == target.id) {
        res.sendStatus(400);
        return;
    };

    if(sender.friends.includes(target.id) ||
        sender.friendRequestsOwn.filter(id => id === sender.id).length > 0 ||
        sender.friendRequests.filter(id => id === sender.id).length > 0
    ) {
        res.sendStatus(409);
        return;
    };

    sender.friendRequests = sender.friendRequestsOwn.filter(id => id !== target.id);
    target.friendRequestsOwn = target.friendRequests.filter(id => id !== sender.id);

    sender.friends.push(target.id);
    target.friends.push(sender.id);

    sender.send("friendRequestAccept", { username: target.username, pfpURL: target.pfpURL, status: target.status, id: target.id });
    target.send("friendRequestAccept", { username: sender.username, pfpURL: sender.pfpURL, status: sender.status, id: sender.id });

    sender.save();
    target.save();

    res.sendStatus(200);
};