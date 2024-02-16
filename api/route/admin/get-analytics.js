const { User } = require("../../../components/User.js");
// const { get_analytics } = require("../../../utils/analytics.js");

module.exports = async (req, res) => {
    if(!req.cookies.token) {
        res.sendStatus(401);
        return;
    }

    const user = new User();
    await user.init({ token: req.cookies.token });

    if(!user) {
        res.sendStatus(404);
        return;
    }

    // res.send(get_analytics);
}