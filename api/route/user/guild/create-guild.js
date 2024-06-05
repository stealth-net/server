const { Guild } = require("../../../../components/Guild.js");

module.exports = async (req, res) => {
    if (!req.cookies.token) {
        res.sendStatus(401);
        return;
    }

    const user = new User();
    await user.initWithToken(req.cookies.token);

    if (!user) {
        res.sendStatus(404);
        return;
    }

    const guild = new Guild();
    await guild.initGuild(user.id);
    guild.addMember(user.id);

    res.status(201).send({ guildId: guild.id });
}