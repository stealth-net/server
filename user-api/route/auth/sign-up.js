const Users = require("../../../utils/users.js");
const User = require("../../../components/User.js");

module.exports = (req, res) => {
    const user = new User(req.body.username, req.body.email, req.body.password);

    Users.save(user);

    res.cookie("token", user.token);
    res.sendStatus(200);
};