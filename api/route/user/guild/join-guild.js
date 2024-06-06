const { User } = require("../../../../components/User.js");
const Invite = require("../../../../components/Invite.js");
const sendStatusIf = require("../../../../utils/resStatus.js");

module.exports = async (req, res) => {
    if (sendStatusIf(res, !req.cookies.token, 401)) return;
    if (sendStatusIf(res, !req.body.code, 400)) return;

    const invite = new Invite();
    await invite.initWithCode(req.body.code);

    if (sendStatusIf(res, invite.isExpired(), 400)) return;

    const user = new User();
    await user.initWithToken(req.cookies.token);

    if (sendStatusIf(res, user.get("guilds").includes(invite.guild_id), 400)) return;
    user.set("guilds", [...user.guilds, invite.guild_id]);

    const guild = await invite.getGuild();
    
    res.status(200).send({ id: invite.guild_id, name: invite.guild_name, pfpURL: guild.pfpURL });
}