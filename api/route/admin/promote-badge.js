const { promote_badge } = require("../../../components/Badge");

module.exports = (req, res) => {
    if(req.body.id && req.body.badge)
        promote_badge(req.body.id, req.body.badge);

    res.sendStatus(200);
}