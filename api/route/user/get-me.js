const { User, fetch_users } = require("../../../components/User.js");

function get(req, res) {
    if(!req.cookies.token) {
        res.sendStatus(401);
        return;
    };

    const user = new User({ token: req.cookies.token });
    if(!user) {
        res.sendStatus(404);
        return;
    };

    user.friendRequests = fetch_users(user.friendRequests);
    user.friendRequestsOwn = fetch_users(user.friendRequestsOwn);
    user.friends = fetch_users(user.friends);

    res.send(user);
};

module.exports = get;