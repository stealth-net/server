const path = require("path");
const fs = require("fs");

function validate_directories() {
    Object.entries({
        "./database/last_id.txt": '1',
        "./database/data.db": ''
    }).forEach(([filePath, defaultContent]) => {
        const absolutePath = path.resolve(filePath);
        const directory = path.dirname(absolutePath);

        if(!fs.existsSync(directory)) fs.mkdirSync(directory, { recursive: true });
        if(!fs.existsSync(absolutePath)) fs.writeFileSync(absolutePath, defaultContent || '');
    });
}

module.exports = validate_directories;