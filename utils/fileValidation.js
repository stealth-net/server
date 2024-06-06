const path = require("path");
const fs = require("fs");

function validateDirectories() {
    Object.entries({
        "./database/lastId.txt": '1',
        "./database/data.db": ''
    }).forEach(([filePath, defaultContent]) => {
        const absolutePath = path.resolve(filePath);
        const directory = path.dirname(absolutePath);

        if(!fs.existsSync(directory)) fs.mkdirSync(directory, { recursive: true });
        if(!fs.existsSync(absolutePath)) fs.writeFileSync(absolutePath, defaultContent || '');
    });
}

module.exports = validateDirectories;