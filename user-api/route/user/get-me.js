const { User } = require("../../../components/User.js");

function get(req, res) {
    if(!req.cookies.token) {
        res.sendStatus(401);
        return;
    };

    const user = new User({ token: req.cookies.token });
    if(!user) {
        res.sendStatus(404);
        return;
    };

    stealth.events.emit("apireq");

    res.send(user);
};

module.exports = get;