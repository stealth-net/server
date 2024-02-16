const { User, query_search } = require("../../../../components/User.js");

module.exports = async (req, res) => {
    if(!req.cookies.token) {
        console.log("No token provided");
        res.sendStatus(401);
        return;
    }

    const sender = new User();
    await sender.initWithToken(req.cookies.token);

    const targetData = await query_search(req.body.id, "id");
    if (!targetData) {
        console.log("Target data not found");
        res.sendStatus(400);
        return;
    }
    const target = new User();
    await target.initWithToken(targetData.token);

    if(sender.get('id') == target.get('id')) {
        console.log("Sender and target are the same user");
        res.sendStatus(400);
        return;
    }

    const targetFriendRequests = target.get('friendRequests');
    const senderFriendRequestsOwn = sender.get('friendRequestsOwn');

    sender.set('friendRequestsOwn', JSON.stringify(senderFriendRequestsOwn.filter(id => id !== target.id)));
    target.set('friendRequests', JSON.stringify(targetFriendRequests.filter(id => id !== sender.id)));

    target.send("friendRequestCancel", sender.id);

    res.sendStatus(200);
}