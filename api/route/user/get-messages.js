const { User, query_search } = require("../../../components/User.js");
const { Conversation, get_conversation } = require("../../../components/Conversation.js");

module.exports = async (req, res) => {
    if(!req.cookies.token) {
        res.sendStatus(401);
        return;
    }

    const { conversationId, start, end } = req.query;
    if (!conversationId || start === undefined || end === undefined) {
        res.status(400).send("Missing conversation ID or message range.");
        return;
    }

    const user = new User();
    await user.initWithToken(req.cookies.token);
    if (!user) {
        res.status(404).send("User not found.");
        return;
    }

    const conversation = await get_conversation(conversationId);
    if (!conversation) {
        res.status(404).send("Conversation not found.");
        return;
    }

    // Ensure the user is part of the conversation
    const participants = conversationId.split("-");
    if (!participants.includes(user.id)) {
        res.status(403).send("User not part of the conversation.");
        return;
    }

    const messages = conversation.messages.slice(start, end);
    res.status(200).json(messages);
};