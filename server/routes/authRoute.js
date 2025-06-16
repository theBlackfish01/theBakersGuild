// ────────────────────────────
// File: server/routes/authRoute.js
// ────────────────────────────
const router = require("express").Router();
const C      = require("../controllers/authController");
const guard  = require("../middlewares/auth");

/* /auth */
router.post("/register", C.register);
router.post("/login",    C.login);
router.get("/me", guard, C.me);
router.post("/logout",   C.logout);

module.exports = router;
