const { User, query_search } = require("../../../components/User.js");

module.exports = async (req, res) => {
    if(!req.cookies.token) {
        res.sendStatus(401);
        return;
    }

    const userProperties = await query_search(req.cookies.token, "token");
    if(!userProperties) {
        res.sendStatus(404);
        return;
    }

    const user = new User();
    await user.initWithToken(userProperties.token);

    user.save();

    res.send(await user.getAllProperties());
}