const fs = require("fs");
const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const { EventEmitter } = require("events");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const CryptedJSONdb = require("cryptedjsondb");
require('dotenv').config({ path: "./.env" });

const log = require("./utils/log.js");

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const publicDir = path.join(__dirname, "public");
const server = http.createServer(app);
const io = socketIO(server);

const config = require("./config.json");

global.stealth = {
    events: new EventEmitter(),
    app,
    server,
    io,
    config,
    id_manager: new (require("./utils/id_manager.js"))("./database/last_id.txt"),
    database: {
        "users": new CryptedJSONdb("./database/users.json", {
            encryption: config.encryptDatabase,
            key: process.env.databaseKey,
            minify: process.env.minifyDatabase
        })
    },
    env: process.env,
    log,
    sockets: {}
};

require("./utils/file_validation.js")();

if(config.collectAnalytics) require("./utils/analytics.js");

require("./user-api/auth_api.js")(app);
require("./user-api/user_api.js")(app);
require("./user-api/admin_api.js")(app);

const { User } = require("./components/User.js");

app.get('/', (req, res) => {
    if(!req.cookies.token) {
        res.redirect("/sign-up");
        return;
    };

    res.sendFile(path.join(publicDir, "/mainpage/index.html"));
});

app.get('/mainpage/css/main.css', (req, res) => {
    res.sendFile(path.join(publicDir, "/mainpage/css/main.css"));
});

fs.readdirSync(publicDir).forEach((fileOrFolder) => {
    if(fileOrFolder == "index.html") return;

    const filePath = path.join(publicDir, fileOrFolder);

    if(fs.statSync(filePath).isDirectory()) {
        app.use(`/${fileOrFolder}`, express.static(filePath));
        // log(`Successfully routed folder "${fileOrFolder}"`, "INFO");
    } else {
        app.get(`/${fileOrFolder}`, (req, res) => {
            res.sendFile(filePath);
            // log(`Successfully routed file: ${fileOrFolder}`, "INFO");
        });
    };
});

io.on('connection', (socket) => {
    const token = decodeURIComponent(socket.request.headers.cookie.replace("token=", ''));

    if (/^[A-Za-z0-9_\-]+=*\.[A-Za-z0-9_\-]+=*\.[A-Za-z0-9_\-]+=*$/.test(token)) {
        socket.token = token;
        socket.authorized = true;
    } else {
        socket.authorized = false;
        socket.disconnect();
    };
    
    const user = new User({
        token: socket.token
    });

    if(stealth.sockets[user.id]) {
        socket.disconnect();
        return;
    };
    stealth.sockets[user.id] = socket;

    user.set("status", "online");

    socket.on("disconnect", () => {
        delete stealth.sockets[user.id];
        user.set("status", "offline");
    });
});

server.listen(config.port, () => {
    log("Server is running on *:" + config.port, "INFO");
});