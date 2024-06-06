const sendStatusIf = require("../../../../utils/resStatus.js");
const db = stealth.database;

module.exports = async (req, res) => {
    const guildID = req.query.guildId;
    if (sendStatusIf(res, !guildID, 400, 'Guild ID is required')) return;

    try {
        const sql = 'SELECT * FROM guilds WHERE id = ?';
        db.get(sql, [guildID], (err, guild) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            if (sendStatusIf(res, !guild, 404, 'Guild not found')) return;
            res.json(guild);
        });
    } catch (error) {
        console.error('Failed to retrieve guild:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}