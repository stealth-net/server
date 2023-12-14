const { queue_search } = require("../../../utils/users.js");

module.exports = (req, res) => {
    if(!req.cookies.token) {
        res.sendStatus(401);
        return;
    };

    const user = queue_search(req.cookies.token, "token");

    user.pfpURL = req.body.pfpURL;
    
    save(user);

    res.send(user);
};