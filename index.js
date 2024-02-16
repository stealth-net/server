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

if(!process.env.databaseKey) {
    console.error("Error: Please provide a database key in the .env");
    process.exit(1);
}

const log = require("./utils/log.js");

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const publicDir = path.join(__dirname, "public");
const server = http.createServer(app);
const io = socketIO(server);

const config = require("./config.json");

const dbFilePath = "./database/data.db";

if (!fs.existsSync(dbFilePath)) fs.writeFileSync(dbFilePath, "");
let db = new sqlite3.Database(dbFilePath, sqlite3.OPEN_READWRITE, (err) => {
    if(err) {
        console.error(err.message);
        throw err;
    }
    log('Connected to the SQLite database.', "INFO");
});

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
    await user.initWithToken(userProperties.token);

    if(typeof user == "undefined" || stealth.sockets[user.id] || JSON.stringify(user) == '{}') {
        socket.disconnect();
        return;
    }

    stealth.sockets[user.id] = socket;

    user.setStatus("online");

    const friendsList = user.get('friends');
    if(friendsList.length > 0) {
        const friendsToSend = await fetch_users(friendsList);
        friendsToSend.forEach(async (friend) => {
            const friendUser = new User();
            await friendUser.initWithToken(friend.token);
            
            await friendUser.send("statusChanged", user.id, user.status);
        });

        socket.on("disconnect", async () => {
            delete stealth.sockets[user.id];
            user.setStatus("offline");

            const newFriendsToSend = await fetch_users(friendsList);
            newFriendsToSend.forEach(async (newFriend) => {
                const newFriendUser = new User();
                await newFriendUser.initWithToken(newFriend.token);
                
                await newFriendUser.send("statusChanged", user.id, user.status);
            });
        });
    }
});

server.listen(config.port, () => {
    log("Server is running on *:" + config.port, "INFO");
});