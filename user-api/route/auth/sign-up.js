const User = require("../../../components/User.js");

module.exports = (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });

    res.cookie("token", user.token);
    res.sendStatus(200);
};