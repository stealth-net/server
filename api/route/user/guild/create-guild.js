const { User } = require("../../../../components/User.js");
const Guild = require("../../../../components/Guild.js");
const sendStatusIf = require("../../../../utils/resStatus.js");

module.exports = async (req, res) => {
    if (sendStatusIf(res, !req.cookies.token, 401)) return;

    const user = new User();
    await user.initWithToken(req.cookies.token);
    
    if (sendStatusIf(res, !user, 404)) return;

    const guild = new Guild();
    await guild.initWithName(req.body.name);
    await guild.addMember(user.id);
    await guild.setOwner(user.id);
    await guild.save();

    res.status(201).send(guild);
}