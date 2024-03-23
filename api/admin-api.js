const routes = {
    POST: {
        "/admin-api/v1/promote-badge": "./route/admin/promote-badge.js",
        "/admin-api/v1/demote-badge": "./route/admin/demote-badge.js"
    },
    GET: {
        "/admin-api/v1/get-analytics": "./route/admin/get-analytics.js",
        "/admin-api/v1/get-user/:userId": "./route/admin/get-user.js"
    }
}

function initRequests(app) {
    for(const method in routes) {
        for(const path in routes[method]) {
            if(path.includes(":userId")) {
                app[method.toLowerCase()](path, async (req, res) => {
                    const userId = req.params.userId;
                    const modulePath = routes[method][path].replace(":userId", userId);
                    await require(modulePath)(req, res);
                });
            } else {
                app[method.toLowerCase()](path, (req, res) => {
                    require(`${routes[method][path]}`)(req, res);
                });
            }
        }
    }
}

module.exports = initRequests;