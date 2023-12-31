const fs = require("fs");
const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const { EventEmitter } = require("events");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const CryptedJSONdb = require("cryptedjsondb");
// const { Database } = require("@journeyapps/sqlcipher");
require('dotenv').config({ path: "./.env" });

if (!process.env.databaseKey) {
    console.error("Error: Please provide a database key using process.env.databaseKey");
    process.exit(1);
};

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
        users: new CryptedJSONdb("./database/users.db", {
            key: process.env.databaseKey,
            minify: false,
            encryption: false
        })
    },
    env: process.env,
    log,
    sockets: {}
};

// not sure if it's necessary
// require("./utils/file_validation.js")();

if(config.collectAnalytics) require("./utils/analytics.js");

require("./api/auth_api.js")(app);
require("./api/user_api.js")(app);
require("./api/admin_api.js")(app);

const { User, fetch_users } = require("./components/User.js");

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
    if(!token) {
        socket.disconnect();
        return;
    };

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

    if(typeof user == "undefined" || stealth.sockets[user.id]) {
        socket.disconnect();
        return;
    };

    stealth.sockets[user.id] = socket;

    user.setStatus("online");

    if(user.friends.length > 0)
        fetch_users(user.friends).forEach(friend => {
            friend.send("statusChanged", user.id, user.status);
        });

    socket.on("disconnect", () => {
        delete stealth.sockets[user.id];
        user.setStatus("offline");

        if(user.friends.length > 0)
            fetch_users(user.friends).forEach(friend => {
                friend.send("statusChanged", user.id, user.status);
            });
    });
});

server.listen(config.port, () => {
    log("Server is running on *:" + config.port, "INFO");
});