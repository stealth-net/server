const fs = require("fs");
const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const { EventEmitter } = require("events");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
require('dotenv').config({ path: "./.env" });

const config = require("./config.json");

const log = require("./utils/log.js");

if(!process.env.databaseKey) {
    log("WARN", "Please provide a database key in the .env");
    process.exit(1);
}

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const publicDir = path.join(__dirname, config.publicDirectory);
const server = http.createServer(app);
const io = socketIO(server);

if (!fs.existsSync(config.databasePath)) fs.writeFileSync(config.databasePath, "");
let db = new sqlite3.Database(config.databasePath, sqlite3.OPEN_READWRITE, (err) => {
    if(err) {
        console.error(err.message);
        throw err;
    }
    log("INFO", 'Connected to the SQLite database.');
});

/**
 * @global
 * @typedef {Object} StealthObject
 * @property {EventEmitter} events - EventEmitter instance
 * @property {express.Application} app - Express application instance
 * @property {http.Server} server - HTTP server instance
 * @property {socketIO.Server} io - Socket.IO server instance
 * @property {Object} config - Configuration object
 * @property {Object} id_manager - ID manager object
 * @property {sqlite3.Database} database - SQLite database instance
 * @property {Object} env - Process environment variables
 * @property {Function} log - Logging function
 * @property {Object} sockets - Object to store sockets
 */

/**
 * Global object for StealthNet application.
 * @type {StealthObject}
 */
global.stealth = {
    events: new EventEmitter(),
    app,
    server,
    io,
    config,
    id_manager: new (require("./utils/id_manager.js"))("./database/last_id.txt"),
    database: db,
    env: process.env,
    log,
    sockets: {}
}

if(config.collectAnalytics) require("./utils/analytics.js");

require("./api/auth_api.js")(app);
require("./api/user_api.js")(app);
require("./api/admin_api.js")(app);

const { User, fetch_users, query_search } = require("./components/User.js");

app.get('/', (req, res) => {
    if(!req.cookies.token) {
        res.redirect("/sign-up");
        return;
    }

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
    } else {
        app.get(`/${fileOrFolder}`, (req, res) => {
            res.sendFile(filePath);
        });
    }
});

io.on('connection', async (socket) => {
    const token = decodeURIComponent(socket.request.headers.cookie.replace("token=", ''));
    if(!token) {
        socket.disconnect();
        return;
    }

    const userProperties = await query_search(token, "token");
    if(!userProperties) {
        socket.disconnect();
        return;
    }

    if(/^[A-Za-z0-9_\-]+=*\.[A-Za-z0-9_\-]+=*\.[A-Za-z0-9_\-]+=*$/.test(token)) {
        socket.token = token;
        socket.authorized = true;
    } else {
        socket.authorized = false;
        socket.disconnect();
    }
    
    const user = new User();
    await user.initWithToken(socket.token);

    if(typeof user == "undefined" || stealth.sockets[user.id] || JSON.stringify(user) == '{}') {
        socket.disconnect();
        return;
    }

    stealth.sockets[user.id] = socket;

    user.setStatus("online");

    log("USERS", `User ${user.id} connected`);

    const friendsList = user.get('friends');
    if(friendsList.length > 0) {
        const friendsToSend = await fetch_users(friendsList);
        friendsToSend.forEach(async (friend) => {
            const friendUser = new User();
            await friendUser.initWithToken(friend.token);
            
            friendUser.send("statusChanged", user.id, user.status);
        });

        socket.on("disconnect", async () => {
            delete stealth.sockets[user.id];
            user.setStatus("offline");

            const newFriendsToSend = await fetch_users(friendsList);
            newFriendsToSend.forEach(async (newFriend) => {
                const newFriendUser = new User();
                await newFriendUser.initWithToken(newFriend.token);
                
                newFriendUser.send("statusChanged", user.id, user.status);
            });
        });
    }
});

process.on('SIGINT', async () => {
    db.run("UPDATE users SET status = 'offline'", function(err) {
        if (err) {
            log("ERROR", "Error updating user status to offline:", err);
        }
        process.exit(0);
    });
});

server.listen(config.port, () => {
    log("INFO", "Server is running on *:" + config.port);
});