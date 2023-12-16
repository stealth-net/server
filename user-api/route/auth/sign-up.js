const { User, queue_search } = require("../../../components/User.js");

module.exports = (req, res) => {
    const existingUser = queue_search(req.body.username, "username");
    if(existingUser) {
        res.sendStatus(409);
        return;
    };

    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });

    res.cookie("token", user.token);
    res.sendStatus(200);
};