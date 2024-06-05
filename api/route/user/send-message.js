const { User, query_search } = require("../../../components/User.js");
const { Message } = require("../../../components/Message.js");
const { Conversation, get_conversation, get_conversation_id } = require("../../../components/Conversation.js");
const sendStatusIf = require("../../../utils/resStatus.js");

module.exports = async (req, res) => {
    if (sendStatusIf(res, !req.cookies.token, 401)) return;

    const { recipientId, text } = req.body;
    if (sendStatusIf(res, !recipientId || !text, 400, "Missing recipient ID or message text.")) return;

    const sender = new User();
    await sender.initWithToken(req.cookies.token);
    if (sendStatusIf(res, !sender, 404, "Sender not found.")) return;

    const recipientProperties = await query_search(recipientId, "id");
    const recipient = new User();
    await recipient.initWithToken(recipientProperties.token);
    if (sendStatusIf(res, !recipient, 404, "Recipient not found.")) return;

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