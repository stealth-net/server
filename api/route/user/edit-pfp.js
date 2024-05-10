const { User } = require("../../../components/User.js");

module.exports = async (req, res) => {
    if (!req.cookies.token) {
        res.sendStatus(401);
        return;
    }

    try {
        const user = new User();
        await user.initWithToken(req.cookies.token);

        user.set('pfpURL', req.body.pfpURL);
        
        user.save();

        res.send({ pfpURL: user.pfpURL });
    } catch (error) {
        console.error("Failed to update user profile picture:", error);
        res.status(500).send("Failed to update profile picture");
    }
}