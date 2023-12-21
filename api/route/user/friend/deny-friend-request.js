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

    if(sender.friendRequests.filter(id => id === target.id).length === 0) {
        res.sendStatus(403);
        return;
    };

    sender.friendRequests = sender.friendRequestsOwn.filter(id => id !== target.id);
    target.friendRequestsOwn = target.friendRequests.filter(id => id !== sender.id);

    sender.save();
    target.save();

    res.sendStatus(200);
};