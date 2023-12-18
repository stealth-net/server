const path = require("path");

module.exports = {
    entry: "./webpack/mainpage/index.js",
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, "./webpack/mainpage-dist/"),
    },
};