const { User, querySearch } = require("../../../../components/User.js");
const sendStatusIf = require("../../../../utils/resStatus.js");

module.exports = async (req, res) => {
    if (sendStatusIf(res, !req.cookies.token, 401)) return;

    const senderProperties = await querySearch(req.cookies.token, "token");
    if (sendStatusIf(res, !senderProperties, 404, "User not found.")) return;
    const sender = new User();
    await sender.initWithToken(senderProperties.token);

    const targetProperties = await querySearch(req.body.id, "id");
    if (sendStatusIf(res, !targetProperties, 404, "User not found.")) return;
    const target = new User();
    await target.initWithToken(targetProperties.token);

    const senderFriends = sender.get('friends');
    const targetFriends = target.get('friends');

    if (sendStatusIf(res, !senderFriends.includes(target.id), 403, "User not found.")) return;

    sender.set('friends', senderFriends.filter(id => id !== target.id));
    target.set('friends', targetFriends.filter(id => id !== sender.id));

    target.send("friendRemove", sender.id);

    res.sendStatus(200);
}