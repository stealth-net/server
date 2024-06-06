const { demoteBadge } = require("../../../components/Badge.js");

module.exports = (req, res) => {
    if(req.body.id && req.body.badge)
        demoteBadge(req.body.id, req.body.badge);

    res.sendStatus(200);
}