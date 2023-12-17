const fs = require('fs');
const path = require('path');
const readline = require('readline');

async function countLines(filePath) {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });

    let lineCount = 0;

    for await (const line of rl) lineCount++;

    return lineCount;
};

async function processDirectory(directoryPath, result) {
    const files = fs.readdirSync(directoryPath);

    for (const file of files) {
        const filePath = path.join(directoryPath, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            if (file !== "node_modules" && file !== "database") {
                await processDirectory(filePath, result);
            };
        } else if (path.extname(filePath) === ".js") {
            const lineCount = await countLines(filePath);
            result[filePath] = lineCount;
        };
    };
};

async function getAllJsFilesLineCount(rootDirectory) {
    const result = {};
    await processDirectory(rootDirectory, result);
    return result;
};

const rootDirectory = "./";
getAllJsFilesLineCount(rootDirectory)
    .then((result) => {
        console.log(result);
    })
    .catch((error) => {
        console.error(error);
    });