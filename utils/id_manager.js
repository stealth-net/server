const fs = require("fs");

/**
 * Manages unique identifiers by reading from and writing to a file.
 */
class IDManager {
    /**
     * Creates an instance of IDManager.
     * @param {string} filePath - The path to the file where the current ID is stored.
     */
    constructor(filePath) {
        this.filePath = filePath;
    }
    
    /**
     * Retrieves the next available ID, increments it, and updates the file.
     * @returns {number} The next ID.
     */
    getNextID() {
        let currentID = this.readCurrentID();
        currentID++;
        this.writeCurrentID(currentID);
        return currentID;
    }

    /**
     * Reads the current ID from the file.
     * @returns {number} The current ID, or 1 if the file does not exist or contains no valid data.
     */
    readCurrentID() {
        try {
            const data = fs.readFileSync(this.filePath, "utf8");
            return parseInt(data) || 1;
        } catch (error) {
            if(error.code === 'ENOENT') return 1;
            throw error;
        }
    }

    /**
     * Writes the given ID to the file.
     * @param {number} id - The ID to write.
     */
    writeCurrentID(id) {
        try {
            fs.writeFileSync(this.filePath, id.toString(), "utf8");
        } catch (error) {
            throw error;
        }
    }
}

module.exports = IDManager;