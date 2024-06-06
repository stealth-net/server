const { promoteBadge } = require("../../../components/Badge");

module.exports = (req, res) => {
    if(req.body.id && req.body.badge)
        promoteBadge(req.body.id, req.body.badge);

    res.sendStatus(200);
}