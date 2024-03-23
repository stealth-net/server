const routes = {
    POST: {
        "/user-api/v1/edit-pfp": "./route/user/edit-pfp.js",

        "/user-api/v1/add-friend": "./route/user/friend/add-friend.js",
        "/user-api/v1/remove-friend": "./route/user/friend/remove-friend.js",
        "/user-api/v1/accept-friend-request": "./route/user/friend/accept-friend-request.js",
        "/user-api/v1/cancel-friend-request": "./route/user/friend/cancel-friend-request.js",
        "/user-api/v1/deny-friend-request": "./route/user/friend/deny-friend-request.js",

        "/user-api/v1/send-message": "./route/user/send-message.js",
    },
    GET: {
        "/user-api/v1/get-me": "./route/user/get-me.js",
        "/user-api/v1/get-messages": "./route/user/get-messages.js",
        "/user-api/v1/get-file/:fileName": "./route/user/get-file.js" // Include dynamic fileName parameter
    }
}

function initRequests(app) {
    for(const method in routes) {
        for(const path in routes[method]) {
            if (path.includes(":")) { // Check if path includes dynamic parameter
                app[method.toLowerCase()](path, (req, res, next) => {
                    require(`${routes[method][path]}`)(req, res, next);
                });
            } else {
                app[method.toLowerCase()](path, (req, res) => {
                    require(`${routes[method][path]}`)(req, res);
                });
            }
        }
    }
}

require("./route/user/upload-file.js");

module.exports = initRequests;