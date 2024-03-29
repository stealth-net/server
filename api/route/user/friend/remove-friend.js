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
    await sender.initWithToken(senderProperties.token);

    const targetProperties = await query_search(req.body.id, "id");
    if(!targetProperties) {
        res.sendStatus(404);
        return;
    }
    const target = new User();
    await target.initWithToken(targetProperties.token);

    const senderFriends = sender.get('friends');
    const targetFriends = target.get('friends');

    if(!senderFriends.includes(target.id)) {
        res.sendStatus(403);
        return;
    }

    sender.set('friends', senderFriends.filter(id => id !== target.id));
    target.set('friends', targetFriends.filter(id => id !== sender.id));

    target.send("friendRemove", sender.id);

    res.sendStatus(200);
}