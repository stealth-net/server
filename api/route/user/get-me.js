const { User, querySearch } = require("../../../components/User.js");
const sendStatusIf = require("../../../utils/resStatus.js");

module.exports = async (req, res) => {
    if (sendStatusIf(res, !req.cookies.token, 401)) return;

    const userProperties = await querySearch(req.cookies.token, "token");
    if (sendStatusIf(res, !userProperties, 401)) return;

    const user = new User();
    await user.initWithToken(req.cookies.token);

    if (sendStatusIf(res, !user, 404)) return;

    res.send(await user.getAllProperties());
}