const { demote_badge } = require("../../../components/Badge.js");

module.exports = (req, res) => {
    if(req.body.id && req.body.badge)
        demote_badge(req.body.id, req.body.badge);

    res.sendStatus(200);
}