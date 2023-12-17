const { queue_search } = require("../../../components/User.js");

module.exports = (req, res) => {
    const user = queue_search(req.body.email, "email");
    console.log(req.body);

    if(!user) {
        res.sendStatus(404);
        return;
    } else if(user.password !== req.body.password) {
        res.sendStatus(401);
        return;
    };

    res.cookie("token", user.token);
    res.sendStatus(200);
};