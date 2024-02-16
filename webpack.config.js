const path = require("path");

module.exports = {
    mode: "development",
    entry: "./webpack/mainpage/index.js",
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, "./webpack/mainpage-dist/"),
    },
}