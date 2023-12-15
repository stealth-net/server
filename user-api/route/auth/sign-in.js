const { queue_search } = require("../../../utils/users.js");

module.exports = (req, res) => {
    const user = queue_search(req.body.email, "email");

    if(typeof user == "undefined") {
        res.sendStatus(401);
        return;
    };
    if(req.body.password !== user.password) {
        res.sendStatus(401);
        return;
    };

    res.cookie("token", user.token);
    res.sendStatus(200);
};