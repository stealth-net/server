const fs = require("fs");

function validate_directories() {
    Object.entries({
        "./database/last_id.txt": "1000000000000000",
        "./database/users.json": "{}"
    }).forEach(([filePath, defaultContent]) => {
        const absolutePath = path.resolve(filePath);
        const directory = path.dirname(absolutePath);

        if(!fs.existsSync(directory)) fs.mkdirSync(directory, { recursive: true });
        if(!fs.existsSync(absolutePath)) fs.writeFileSync(absolutePath, defaultContent || '');
    });
};

if(stealth.databaseKey == '' || typeof stealth.databaseKey == "undefined") {
    log("The database key was not found. Please ensure that the correct key is provided.", "WARN");
};

module.exports = validate_directories;