const { User, querySearch } = require("../../../../components/User.js");
const sendStatusIf = require("../../../../utils/resStatus.js");

module.exports = async (req, res) => {
    if (sendStatusIf(res, !req.cookies.token, 401)) return;

    const senderProperties = await querySearch(req.cookies.token, "token");
    if (sendStatusIf(res, !senderProperties, 404, "User not found.")) return;
    const sender = new User();
    await sender.init({ token: senderProperties.token });

    const targetProperties = await querySearch(req.body.id, "id");
    if (sendStatusIf(res, !targetProperties, 404, "User not found.")) return;
    const target = new User();
    await target.init({ token: targetProperties.token });

    if (sendStatusIf(res, sender.id == target.id, 400, "User not found.")) return;

    let senderFriendRequests = JSON.parse(sender.friendRequests);
    let targetFriendRequestsOwn = JSON.parse(target.friendRequestsOwn);

    if (sendStatusIf(res, !senderFriendRequests.includes(target.id), 403, "User not found.")) return;

    senderFriendRequests = senderFriendRequests.filter(id => id !== target.id);
    targetFriendRequestsOwn = targetFriendRequestsOwn.filter(id => id !== sender.id);

    sender.friendRequests = JSON.stringify(senderFriendRequests);
    target.friendRequestsOwn = JSON.stringify(targetFriendRequestsOwn);

    sender.save();
    target.save();

    res.sendStatus(200);
}