const { User, query_search } = require("../../../../components/User.js");

module.exports = async (req, res) => {
    if(!req.cookies.token) {
        res.sendStatus(401);
        return;
    }

    const senderProperties = await query_search(req.cookies.token, "token");
    if(!senderProperties) {
        res.sendStatus(404);
        return;
    }
    const sender = new User();
    await sender.init({ token: senderProperties.token });

    const targetProperties = await query_search(req.body.id, "id");
    if(!targetProperties) {
        res.sendStatus(404);
        return;
    }
    const target = new User();
    await target.init({ token: targetProperties.token });

    if(sender.id == target.id) {
        res.sendStatus(400);
        return;
    }

    let senderFriendRequests = JSON.parse(sender.friendRequests);
    let targetFriendRequestsOwn = JSON.parse(target.friendRequestsOwn);

    if(!senderFriendRequests.includes(target.id)) {
        res.sendStatus(403);
        return;
    }

    senderFriendRequests = senderFriendRequests.filter(id => id !== target.id);
    targetFriendRequestsOwn = targetFriendRequestsOwn.filter(id => id !== sender.id);

    sender.friendRequests = JSON.stringify(senderFriendRequests);
    target.friendRequestsOwn = JSON.stringify(targetFriendRequestsOwn);

    sender.save();
    target.save();

    res.sendStatus(200);
}