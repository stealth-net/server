const { queue_search } = require("../../../utils/users.js");

function get(req, res) {
    if(!req.cookies.token) {
        res.sendStatus(401);
        return;
    };

    const user = queue_search(req.cookies.token, "token");
    if(!user) {
        res.sendStatus(404);
        return;
    };

    stealth.events.emit("apireq");

    res.send(user);
};

module.exports = get;