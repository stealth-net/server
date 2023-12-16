const { queue_search } = require("../../../components/User.js");

module.exports = (req, res) => {
    if(!req.cookies.token) {
        res.sendStatus(401);
        return;
    };

    const user = new User({ token: req.cookies.token });

    user.pfpURL = req.body.pfpURL;
    
    save(user);

    res.send(user);
};