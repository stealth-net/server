const fs = require("fs");
const path = require("path");
const express = require("express");

const POST = {
    "/auth-api/v1/sign-up": "./route/auth/sign-up.js",
    "/auth-api/v1/sign-in": "./route/auth/sign-in.js"
};

const GET = [
    "/sign-up",
    "/sign-in"
];

function initPages(app) {
    for(const route in GET) {
        app.get(GET[route], (req, res) => {
            if(req.cookies.token) {
                res.redirect("/");
                return;
            };

            res.sendFile("./public" + GET[route] + "/index.html", {
                root: '.'
            });
        });

        const publicDir = path.join("../server/public/" + GET[route]);

        fs.readdirSync(publicDir).forEach((fileOrFolder) => {
            if(fileOrFolder == "index.html") return;
          
            const filePath = path.join(publicDir, fileOrFolder);
            
            if(fs.statSync(filePath).isDirectory()) {
                app.use(`/${fileOrFolder}`, express.static(filePath));
            } else {
                app.get(`/${fileOrFolder}`, (req, res) => {
                    res.sendFile(filePath);
                });
            };
        });
    };
};

function initRequests(app) {
    initPages(app);

    for(const path in POST) {
        app.post(path, (req, res) => {
            require(POST[path])(req, res);
        });
    };
};

module.exports = initRequests;