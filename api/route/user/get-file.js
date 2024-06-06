const fs = require("fs");
const path = require("path");
const { querySearch } = require("../../../components/User.js");
const sendStatusIf = require("../../../utils/resStatus.js");

module.exports = async (req, res) => {
    if (sendStatusIf(res, !req.cookies.token, 401)) return;

    const userProperties = await querySearch(req.cookies.token, "token");
    if (sendStatusIf(res, !userProperties, 401)) return;

    const { fileName } = req.params;
    const filePath = path.join(__dirname, "../../../database/uploads", fileName);

    fs.access(filePath, fs.constants.F_OK, err => {
        if (err) {
            return res.status(404).send("File not found");
        }

        res.sendFile(filePath, (err) => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).send('Error serving the file');
            }
        });
    });
};