const { User } = require("../../../components/User.js");
const sendStatusIf = require("../../../utils/resStatus.js");

module.exports = async (req, res) => {
    if (sendStatusIf(res, !req.cookies.token, 401)) return;

    try {
        const user = new User();
        await user.initWithToken(req.cookies.token);

        const base64Data = req.body.base64;
        user.set("pfpURL", base64Data);
        await user.save();

        res.send({ pfpURL: user.pfpURL });
    } catch (error) {
        if (error instanceof multer.MulterError && error.code === 'LIMIT_UNEXPECTED_FILE') {
            console.error("Request entity too large:", error);
            res.status(413).send("Profile picture too large");
        } else {
            console.error("Failed to update user profile picture:", error);
            res.status(500).send("Failed to update profile picture");
        }
    }
}