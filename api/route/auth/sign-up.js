const { User, query_search } = require("../../../components/User.js");

module.exports = async (req, res) => {
    const existingUser = await query_search(req.body.username, "username");
    if(existingUser) {
        res.sendStatus(409);
        return;
    }

    const user = new User();
    user.init({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });
    user.save();

    res.cookie("token", user.token);
    res.sendStatus(200);
}