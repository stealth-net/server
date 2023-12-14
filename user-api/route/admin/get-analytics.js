const { queue_search } = require("../../../utils/users.js");
const { get_analytics } = require("../../../utils/analytics.js");

module.exports = (req, res) => {
    if(!req.cookies.token) {
        res.sendStatus(401);
        return;
    };

    const user = queue_search(req.cookies.token, "token");

    if(!user) {
        res.sendStatus(404);
        return;
    };

    res.send(get_analytics());
};