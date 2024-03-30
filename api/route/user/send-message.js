const { User, query_search } = require("../../../components/User.js");
const { Message } = require("../../../components/Message.js");
const { Conversation, get_conversation, get_conversation_id } = require("../../../components/Conversation.js");
const log = require("../../../utils/log.js");

module.exports = async (req, res) => {
    if(!req.cookies.token) {
        res.sendStatus(401);
        return;
    }

    const { recipientId, text } = req.body;
    if (!recipientId || !text) {
        res.status(400).send("Missing recipient ID or message text.");
        return;
    }

    const sender = new User();
    await sender.initWithToken(req.cookies.token);
    if (!sender) {
        res.status(404).send("Sender not found.");
        return;
    }

    const recipientProperties = await query_search(recipientId, "id");
    const recipient = new User();
    await recipient.initWithToken(recipientProperties.token);
    if (!recipient) {
        res.status(404).send("Recipient not found.");
        return;
    }

    const conversationId = get_conversation_id(sender.id, recipient.id);
    let conversation = await get_conversation(conversationId);

    if (!conversation) {
        conversation = new Conversation(sender.id, recipient.id);
        await conversation.save();
    }

    const message = new Message({
        senderId: sender.id,
        recipientId: recipient.id,
        content: text,
        conversationId
    });

    const socket = sender.getSocket();
    if (socket && socket.handshake.headers.savemessages === "true") {
        await message.save();
    }

    recipient.send("newMessage", {
        author: { username: sender.username, pfpURL: sender.pfpURL },
        content: text,
        creationTime: message.creationTime
    });
    
    res.sendStatus(200);
}