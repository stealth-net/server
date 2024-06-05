const { User } = require("../../../components/User.js");
const sendStatusIf = require("../../../utils/resStatus.js");

module.exports = async (req, res) => {
    if (sendStatusIf(res, !req.cookies.token, 401)) return;

    try {
        const user = new User();
        await user.initWithToken(req.cookies.token);

        user.set("pfpURL", req.body.pfpURL);

        res.send({ pfpURL: user.pfpURL });
    } catch (error) {
        console.error("Failed to update user profile picture:", error);
        res.status(500).send("Failed to update profile picture");
    }
}