const { queue_search } = require("../../../components/User.js");
const { get_analytics } = require("../../../utils/analytics.js");

module.exports = (req, res) => {
    if(!req.cookies.token) {
        res.sendStatus(401);
        return;
    };

    const user = new User({ token: req.cookies.token });

    if(!user) {
        res.sendStatus(404);
        return;
    };

    res.send(get_analytics());
};