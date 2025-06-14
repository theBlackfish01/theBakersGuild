// api/index.js   – single entry that proxies to Express
const app = require("../server/app");    // ← your Express instance

module.exports = (req, res) => {
    // NOTE: path starts after `/api`, so Express sees `/user/guest`
    req.url = req.url.replace(/^\/api/, "");  // strip prefix for Express
    return app(req, res);
};
