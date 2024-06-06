const { User, querySearch, safeUser } = require("../../../../components/User.js");
const sendStatusIf = require("../../../../utils/resStatus.js");

module.exports = async (req, res) => {
    if (sendStatusIf(res, !req.cookies.token, 401)) return;

    const senderProperties = await querySearch(req.cookies.token, "token");
    const targetProperties = await querySearch(req.body.id, "id");

    if (sendStatusIf(res, !senderProperties || !targetProperties || senderProperties.token === targetProperties.token, 404, "User not found.")) return;

    const sender = new User();
    await sender.initWithToken(senderProperties.token);
    const target = new User();
    await target.initWithToken(targetProperties.token);

    let targetFriends = target.get("friends");
    let senderFriends = sender.get("friends");
    const targetFriendRequests = target.get("friendRequests");
    const senderFriendRequestsOwn = sender.get("friendRequestsOwn");

    if(senderFriends.includes(target.id) ||
        senderFriendRequestsOwn.includes(target.id) ||
        targetFriendRequests.includes(sender.id)
    ) {
        res.sendStatus(409);
        return;
    }

    senderFriends.push(target.id);
    targetFriends.push(sender.id);

    sender.set("friends", senderFriends);
    target.set("friends", targetFriends);

    sender.set("friendRequests", JSON.stringify(targetFriendRequests.filter(id => id !== sender.id)));
    target.set("friendRequestsOwn", JSON.stringify(senderFriendRequestsOwn.filter(id => id !== target.id)));

    sender.send("friendRequestAccept", { username: target.get("username"), pfpURL: target.get("pfpURL"), id: target.get("id"), target: sender.get("status") });
    target.send("friendRequestAccept", { username: sender.get("username"), pfpURL: sender.get("pfpURL"), id: sender.get("id"), status: sender.get("status") });

    res.send(safeUser(target));
}