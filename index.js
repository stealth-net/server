const fs = require("fs");
const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const { EventEmitter } = require("events");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const readline = require("readline");
require('dotenv').config({ path: "./.env" });

const config = require("./config.json");

const { log, parseCookies } = require("./utils/log.js");

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
let db = new sqlite3.Database(config.databasePath, sqlite3.OPEN_READWRITE, err => {
    if(err) {
        console.error(err.message);
        throw err;
    }
    log("INFO", 'Connected to the SQLite database.');
});

/**
 * @global
 * @property {EventEmitter} events - EventEmitter instance
 * @property {express.Application} app - Express application instance
 * @property {http.Server} server - HTTP server instance
 * @property {socketIO.Server} io - Socket.IO server instance
 * @property {Object} config - Configuration object
 * @property {Object} idManager - ID manager object
 * @property {sqlite3.Database} database - SQLite database instance
 * @property {Object} env - Process environment variables
 * @property {Function} log - Logging function
 * @property {Object} sockets - Object to store sockets
*/

global.stealth = {
    events: new EventEmitter(),
    app,
    server,
    io,
    config,
    idManager: new (require("./utils/idManager.js"))("./database/lastId.txt"),
    database: db,
    env: process.env,
    log,
    sockets: {}
}

require("./api/auth-api.js")(app);
require("./api/user-api.js")(app);
require("./api/admin-api.js")(app);

if(config.collectAnalytics) require("./utils/analytics.js");
const { User, fetchUsers, querySearch } = require("./components/User.js");
const { getBadge } = require("./components/Badge.js");

app.get('/', (req, res) => {
    if(!req.cookies.token) {
        res.redirect("/sign-up");
        return;
    }

    res.sendFile(path.join(publicDir, "/mainpage/index.html"));
});

app.get("/mainpage/css/main.css", (req, res) => {
    res.sendFile(path.join(publicDir, "/mainpage/css/main.css"));
});

fs.readdirSync(publicDir).forEach(fileOrFolder => {
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

io.on("connection", async socket => {
    const cookies = parseCookies(socket.request.headers.cookie);
    const token = cookies.token;

    if (!token || !(await querySearch(token, "token"))) {
        socket.disconnect();
        return;
    }

    const jwtPattern = /^[A-Za-z0-9_\-]+=*\.[A-Za-z0-9_\-]+=*\.[A-Za-z0-9_\-]+=*$/;
    if (jwtPattern.test(token)) {
        socket.token = token;
        socket.authorized = true;
    } else {
        socket.authorized = false;
        socket.disconnect();
    }
    
    const user = new User();
    await user.initWithToken(socket.token);

    if(typeof user == "undefined" || stealth.sockets[user.id] || JSON.stringify(user) == "{}") {
        socket.disconnect();
        return;
    }

    stealth.sockets[user.id] = socket;

    socket.on("registerAdmin", async () => {
        const developerBadgeId = getBadge("Developer").id.toString();
        if(user.badges && user.badges.includes(developerBadgeId)) {
            log("INFO", `Admin ${user.username} (${user.id}) registered`);
            socket.join("admin");
        } else {
            log("WARN", `User ${user.username} (${user.id}) tried to register as admin, but they don't have the Developer badge.`);
            socket.emit("notAdmin");
            socket.disconnect();
        }
    });

    user.setStatus("online");

    log("USERS", `User ${user.id} connected`);

    const friendsList = user.get("friends");
    if(friendsList.length > 0) {
        const friendsToSend = await fetchUsers(friendsList);
        friendsToSend.forEach(async (friend) => {
            const friendUser = new User();
            await friendUser.initWithToken(friend.token);
            
            friendUser.send("statusChanged", user.id, user.status);
        });

        socket.on("disconnect", async () => {
            const newFriendsToSend = await fetchUsers(friendsList);
            newFriendsToSend.forEach(async (newFriend) => {
                const newFriendUser = new User();
                await newFriendUser.initWithToken(newFriend.token);
                
                newFriendUser.send("statusChanged", user.id, user.status);
            });
        });
    }

    socket.on("disconnect", () => {
        delete stealth.sockets[user.id];
        user.setStatus("offline");
    });
});

const Command = require("./utils/commands.js");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on("line", input => {
    new Command(input);
});

process.on('SIGINT', async () => {
    db.run("UPDATE users SET status = 'offline'", err => {
        if (err) {
            log("ERROR", "Error updating user status to offline:", err);
        }
        process.exit(0);
    });
});

server.listen(config.port, () => {
    log("INFO", "Server is running on *:" + config.port);
});