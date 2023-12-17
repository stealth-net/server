const routes = {
    POST: {
        "/admin-api/v1/promote-badge": "./route/admin/promote-badge.js",
        "/admin-api/v1/demote-badge": "./route/admin/demote-badge.js"
    },
    GET: {
        "/admin-api/v1/get-analytics": "./route/admin/get-analytics.js"
    }
};

function initRequests(app) {
    for(const method in routes) {
        for(const path in routes[method]) {
            app[method.toLowerCase()](path, (req, res) => {
                require(`${routes[method][path]}`)(req, res);
            });
        };
    };
};

module.exports = initRequests;