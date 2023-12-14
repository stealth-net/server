const fs = require('fs');

class IDManager {
    constructor(filePath) {
        this.filePath = filePath;
    };
    getNextID() {
        let currentID = this.readCurrentID();
        currentID++;
        this.writeCurrentID(currentID);
        return currentID;
    };
    readCurrentID() {
        try {
            const data = fs.readFileSync(this.filePath, 'utf8');
            return parseInt(data) || 1000000000000000;
        } catch (error) {
            if (error.code === 'ENOENT') return 1000000000000000;
            throw error;
        };
    };
    writeCurrentID(id) {
        try {
            fs.writeFileSync(this.filePath, id.toString(), 'utf8');
        } catch (error) {
            throw error;
        };
    };
};

module.exports = IDManager;