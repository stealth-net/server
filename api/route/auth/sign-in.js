const { User, query_search } = require("../../../components/User.js");

module.exports = async (req, res) => {
    const userProperties = await query_search(req.body.email, "email");

    if(!userProperties) {
        res.sendStatus(404);
        return;
    }

    const user = new User();
    await user.init({ token: userProperties.token });
    user.save();

    if(user.password !== req.body.password) {
        res.sendStatus(401);
        return;
    }

    res.cookie("token", user.token);
    res.sendStatus(200);
}