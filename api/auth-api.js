const POST = {
    "/auth-api/v1/sign-up": "./route/auth/sign-up.js",
    "/auth-api/v1/sign-in": "./route/auth/sign-in.js"
}

function initRequests(app) {
    for(const path in POST) {
        app.post(path, (req, res) => {
            require(POST[path])(req, res);
        });
    }
}

module.exports = initRequests;