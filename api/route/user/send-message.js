const { User, safe_user } = require("../../../components/User.js");
const Message = require("../../../components/Message.js");

module.exports = (req, res) => {
    if(!req.cookies.token) {
        res.sendStatus(401);
        return;
    }

    const author = new User({ token: req.cookies.token });

    const message = new Message(safe_user(author), req.body.content);

    message.save();

    res.status(200);
}