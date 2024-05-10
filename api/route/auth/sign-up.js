const { User, query_search } = require("../../../components/User.js");
const { log } = require("../../../utils/log.js");

module.exports = async (req, res) => {
    const existingUsername = await query_search(req.body.username, "username");
    if(existingUsername) {
        res.status(409).send("Username already registered");
        return;
    }

    const existingEmail = await query_search(req.body.email, "email");
    if(existingEmail) {
        res.status(409).send("Email already registered");
        return;
    }

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