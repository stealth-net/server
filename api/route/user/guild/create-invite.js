const { User } = require("../../../../components/User.js");
const Invite = require("../../../../components/Invite.js");
const sendStatusIf = require("../../../../utils/resStatus.js");

module.exports = async (req, res) => {
    if (sendStatusIf(res, !req.cookies.token, 401)) return;
    if (sendStatusIf(res, !req.body.guild_id, 400)) return;

    const user = new User();
    await user.initWithToken(req.cookies.token);
    if (sendStatusIf(res, !user.get("guilds").includes(req.body.guild_id), 400)) return;

    const invite = new Invite();
    await invite.initWithGuildID(req.body.guild_id);
    await invite.save();
    
    res.status(200).send({ code: invite.code });
}