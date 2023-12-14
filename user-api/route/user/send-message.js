const { queue_search } = require("../../../../utils/users.js");
const { save } = require("../../../../utils/messages.js");
const Message = require("../../../components/Message.js");

module.exports = (req, res) => {
    if(!req.cookies.token) {
        res.sendStatus(401);
        return;
    };

    const author = queue_search(req.cookies.token, "token");
    if(!author) {
        res.sendStatus(404);
        return;
    };

    const message = new Message(author, req.body.content);

    save(message);

    res.status(200);
};