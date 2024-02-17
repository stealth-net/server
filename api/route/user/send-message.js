const { User, query_search } = require("../../../components/User.js");
const Message = require("../../../components/Message.js");

module.exports = async (req, res) => {
    if(!req.cookies.token) {
        res.sendStatus(401);
        return;
    }

    const author = await new User().initWithToken(req.cookies.token);
    const receiverProperties = await query_search(req.body.receiver, "id");
    const receiver = await new User().initWithToken(receiverProperties.token);
    const message = new Message(author.id, receiver.id, req.body.content);
    message.save();

    receiver.send("newMessage", { from: author.id, content: req.body.content });

    res.sendStatus(200);
}