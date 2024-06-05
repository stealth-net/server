const { User, query_search } = require("../../../../components/User.js");
const sendStatusIf = require("../../../utils/resStatus.js");

module.exports = async (req, res) => {
    if(!req.cookies.token) {
        res.sendStatus(401);
        return;
    }

    const sender = new User();
    await sender.initWithToken(req.cookies.token);

    const targetData = await query_search(req.body.id, "id");
    if (sendStatusIf(res, !targetData, 400, "User not found.")) return;
    const target = new User();
    await target.initWithToken(targetData.token);

    if (sendStatusIf(res, sender.id == target.id, 400, "User not found.")) return;

    const targetFriendRequests = target.get('friendRequests');
    const senderFriendRequestsOwn = sender.get('friendRequestsOwn');

    sender.set('friendRequestsOwn', JSON.stringify(senderFriendRequestsOwn.filter(id => id !== target.id)));
    target.set('friendRequests', JSON.stringify(targetFriendRequests.filter(id => id !== sender.id)));

    target.send("friendRequestCancel", sender.id);

    res.sendStatus(200);
}