const { queue_search } = require("../../../components/User.js");
const { save } = require("../../../../utils/messages.js");
const Message = require("../../../components/Message.js");

module.exports = (req, res) => {
    if(!req.cookies.token) {
        res.sendStatus(401);
        return;
    };

    const author = new User({ token: req.cookies.token });
    if(!author) {
        res.sendStatus(404);
        return;
    };

    const message = new Message(author, req.body.content);

    save(message);

    res.status(200);
};