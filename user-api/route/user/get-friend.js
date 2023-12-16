const { User, queue_search } = require("../../../components/User.js");

function post(req, res) {
    if(!req.cookies.token) {
        res.sendStatus(401);
        return;
    };

    const user = new User({ token: req.cookies.token });
    const target = queue_search(req.body.username, "username");

    if(user.friends.filter(friendUsername => {
        const friendData = queue_search(friendUsername, "username");
        return friendData.id === target.id;
    }).length === 0) {
        res.sendStatus(400);
        return;
    };

    res.send({
        username: target.username,
        pfpURL: target.pfpURL,
        status: target.status
    });
};

module.exports = post;