const { User, query_search } = require("../../../components/User.js");
const { log } = require("../../../utils/log.js");
const sendStatusIf = require("../../../utils/resStatus.js");

module.exports = async (req, res) => {
    const userProperties = await query_search(req.body.email, "email");

    if (sendStatusIf(res, !userProperties, 404, "User not found.")) return;

    const user = new User();
    await user.initWithToken(userProperties.token);

    log("AUTH", `User ${user.id} signed in`);

    if (sendStatusIf(res, user.password !== req.body.password, 401, "Invalid password.")) return;

    res.cookie("token", user.token);
    res.sendStatus(200);
}