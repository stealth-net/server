const { User, query_search, safe_user } = require("../../../../components/User.js");
const sendStatusIf = require("../../../utils/resStatus.js");

module.exports = async (req, res) => {
    if(!req.cookies.token) {
        res.sendStatus(401);
        return;
    }

    const senderProperties = await query_search(req.cookies.token, "token");
    if (sendStatusIf(res, !senderProperties, 404, "User not found.")) return;
    const sender = new User();
    await sender.initWithToken(senderProperties.token);

    const targetProperties = await query_search(req.body.username, "username");
    if (sendStatusIf(res, !targetProperties, 404, "User not found.")) return;
    const target = new User();
    await target.initWithToken(targetProperties.token);

    if (sendStatusIf(res, typeof target == "undefined" || sender.id == target.id, 404, "User not found.")) return;

    let senderFriends = sender.get("friends");
    let senderFriendRequestsOwn = sender.get("friendRequestsOwn");
    let targetFriendRequests = target.get("friendRequests");

    if(senderFriends.includes(target.id) ||
        senderFriendRequestsOwn.includes(sender.id) ||
        targetFriendRequests.includes(sender.id)
    ) {
        res.sendStatus(409);
        return;
    }

    senderFriendRequestsOwn.push(target.id);
    targetFriendRequests.push(sender.id);

    sender.set('friendRequestsOwn', senderFriendRequestsOwn);
    target.set('friendRequests', targetFriendRequests);
    target.send("friendRequest", { username: sender.username, pfpURL: sender.pfpURL, id: sender.id });

    res.send(safe_user(target));
}