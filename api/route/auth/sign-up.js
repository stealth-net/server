const { User, querySearch } = require("../../../components/User.js");
const { log } = require("../../../utils/log.js");
const sendStatusIf = require("../../../utils/resStatus.js");

module.exports = async (req, res) => {
    const existingUsername = await querySearch(req.body.username, "username");
    if (sendStatusIf(res, existingUsername, 409, "Username already registered")) return;

    const existingEmail = await querySearch(req.body.email, "email");
    if (sendStatusIf(res, existingEmail, 409, "Email already registered")) return;

    const user = new User();
    user.init({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });
    user.save();

    log("AUTH", `User ${user.id} signed up`);

    res.cookie("token", user.token);
    res.sendStatus(200);
}