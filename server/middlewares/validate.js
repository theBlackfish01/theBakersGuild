// server/middlewares/validate.js
const { validationResult } = require("express-validator");

/**
 * Wrap an array of express‑validator rules and returns 422 on failure.
 */
module.exports = (schema = []) => [
    ...schema,
    (req, _res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return next({ statusCode: 422, message: errors.array()[0].msg });
        next();
    },
];