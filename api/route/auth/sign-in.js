const { User, query_search } = require("../../../components/User.js");
const log = require("../../../utils/log.js");

module.exports = async (req, res) => {
    const userProperties = await query_search(req.body.email, "email");

    if(!userProperties) {
        res.sendStatus(404);
        return;
    }

    const user = new User();
    await user.initWithToken(userProperties.token);

    log(`User ${user.id} signed in`, "AUTH");

    if(user.password !== req.body.password) {
        res.sendStatus(401);
        return;
    }

    res.cookie("token", user.token);
    res.sendStatus(200);
}