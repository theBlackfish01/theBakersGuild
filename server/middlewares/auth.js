// ────────────────────────────
// File: server/middlewares/auth.js
// Lightweight JWT guard – attachs req.baker
// ────────────────────────────
const Baker = require("../models/Baker");
const { verify } = require("../utils/jwt");

module.exports = async function (req, _res, next) {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        if (!token) throw new Error("Authentication required");
        const decoded = await verify(token);
        const baker   = await Baker.findById(decoded.id);
        if (!baker) throw new Error("User not found");
        req.baker = baker;
        next();
    } catch (err) {
        next({ statusCode: 401, message: err.message });
    }
};
