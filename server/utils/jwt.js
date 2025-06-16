// ────────────────────────────
// File: server/utils/jwt.js
// ────────────────────────────
const jwt  = require("jsonwebtoken");
const opts = { expiresIn: "2h" };

exports.sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, opts);

exports.verify = (token) =>
    new Promise((res, rej) =>
        jwt.verify(token, process.env.JWT_SECRET, (e, d) => (e ? rej(e) : res(d)))
    );
