const fs = require('fs');
const path = require('path');
const { query_search } = require('../../../components/User');

module.exports = async (req, res) => {
    if (!req.cookies.token) {
        return res.status(401).send('Unauthorized');
    }

    const userProperties = await query_search(req.cookies.token, "token");
    if (!userProperties) {
        return res.status(401).send('Unauthorized');
    }

    const { fileName } = req.params;
    const filePath = path.join(__dirname, '../../../database/uploads', fileName);

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).send('File not found');
        }

        res.sendFile(filePath, (err) => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).send('Error serving the file');
            }
        });
    });
};