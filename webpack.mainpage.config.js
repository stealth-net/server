const path = require("path");

module.exports = {
    mode: "development",
    entry: "./webpack/mainpage/index.js",
    output: {
        filename: "app.js",
        path: path.resolve(__dirname, "public", "mainpage"),
    },
}