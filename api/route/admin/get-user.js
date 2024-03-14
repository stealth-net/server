const { User, query_search } = require("../../../components/User.js");

module.exports = async (req, res) => {
    const userIdOrUsername = req.params.userId;
    if(!userIdOrUsername) {
        res.status(400).send("Missing user ID or username");
        return;
    }

    let userProperties = await query_search(userIdOrUsername, "id");
    if(!userProperties) {
        userProperties = await query_search(userIdOrUsername, "username");
        if(!userProperties) {
            res.sendStatus(404);
            return;
        }
    }

    const user = new User();
    await user.initWithToken(userProperties.token);

    res.json(await user.getAllProperties());
}