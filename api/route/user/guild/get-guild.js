const db = stealth.database;

module.exports = async (req, res) => {
    const guildID = req.query.guildID;
    if (!guildID) {
        return res.status(400).json({ error: 'Guild ID is required' });
    }

    try {
        const sql = 'SELECT * FROM guilds WHERE id = ?';
        db.get(sql, [guildID], (err, guild) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            if (!guild) {
                return res.status(404).json({ error: 'Guild not found' });
            }
            res.json(guild);
        });
    } catch (error) {
        console.error('Failed to retrieve guild:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}