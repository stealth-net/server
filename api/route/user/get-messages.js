const { User, querySearch, safeUser } = require("../../../components/User.js");
const { getConversation, getConversationId } = require("../../../components/Conversation.js");
const sendStatusIf = require("../../../utils/resStatus.js");

module.exports = async (req, res) => {
    if(!req.cookies.token) {
        res.sendStatus(401);
        return;
    }

    const { recipientId, start, end } = req.query;
    if (sendStatusIf(res, !recipientId, 400, "Missing recipient ID.")) return;

    const user = new User();
    await user.initWithToken(req.cookies.token);
    if (sendStatusIf(res, !user, 404, "User not found.")) return;

    // Assuming get_conversation now takes two user IDs to find their conversation
    const conversation = await getConversation(getConversationId(user.id, recipientId));
    if (sendStatusIf(res, !conversation, 404, "Conversation not found.")) return;

    // Extract user IDs from the conversation participants
    const senderId = user.id;
    const recipientProperties = await querySearch(recipientId, "id");
    const recipient = new User();
    await recipient.initWithToken(recipientProperties.token);

    if (sendStatusIf(res, !recipient, 404, "Recipient not found.")) return;

    // Append user data to each message
    const messagesWithUserData = conversation.messages.map(message => {
        message.author = message.senderId === senderId ? safeUser(user) : safeUser(recipient);
        return message;
    });

    const messages = messagesWithUserData.slice(-end, -start || undefined);
    res.status(200).json({messages, hasMore: conversation.messages.length > messages.length});
}