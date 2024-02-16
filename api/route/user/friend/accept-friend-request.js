const { User, query_search, safe_user } = require("../../../../components/User.js");

module.exports = async (req, res) => {
    if(!req.cookies.token) {
        console.log("No token provided");
        res.sendStatus(401);
        return;
    }

    const senderProperties = await query_search(req.cookies.token, "token");
    if(!senderProperties) {
        console.log("Sender properties not found");
        res.sendStatus(404);
        return;
    }
    const sender = new User();
    await sender.initWithToken(senderProperties.token);

    const targetProperties = await query_search(req.body.id, "id");
    if(!targetProperties) {
        console.log("Target properties not found");
        res.sendStatus(404);
        return;
    }
    const target = new User();
    await target.initWithToken(targetProperties.token);

    if(typeof target == "undefined" || sender.id == target.id) {
        console.log("Invalid target or sender");
        res.sendStatus(404);
        return;
    }

    let targetFriends = target.get("friends");
    let senderFriends = sender.get("friends");
    const targetFriendRequests = target.get('friendRequests');
    const senderFriendRequestsOwn = sender.get('friendRequestsOwn');

    if(senderFriends.includes(target.id) ||
        senderFriendRequestsOwn.includes(target.id) ||
        targetFriendRequests.includes(sender.id)
    ) {
        console.log("Friend request already exists");
        res.sendStatus(409);
        return;
    }

    senderFriends.push(target.id);
    targetFriends.push(sender.id);

    sender.set('friends', senderFriends);
    target.set('friends', targetFriends);

    sender.set('friendRequests', JSON.stringify(targetFriendRequests.filter(id => id !== sender.id)));
    target.set('friendRequestsOwn', JSON.stringify(senderFriendRequestsOwn.filter(id => id !== target.id)));

    target.get("friendRequestAccept", { username: sender.get("username"), pfpURL: sender.get("pfpURL"), id: sender.get("id") });

    res.send(safe_user(target));
}