// /api/[...path].js  –  Vercel catch-all that forwards everything to Express
const app = require("../server/app");   // the Express instance you built

module.exports = (req, res) => {
    // Vercel supplies req/res that are fully compatible with Express
    return app(req, res);
};
