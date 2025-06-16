// api/index.js  (single entry for every /api/** request)
const app = require("../server/app");     // Express instance

module.exports = (req, res) => {
    // Strip the "/api" prefix so Express sees the original route
    req.url = req.url.replace(/^\/api/, "");
    return app(req, res);
};