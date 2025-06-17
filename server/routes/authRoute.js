// server/routes/authRoute.js
const router = require("express").Router();
const { body } = require("express-validator");
const C = require("../controllers/authController");
const guard = require("../middlewares/auth");
const validate = require("../middlewares/validate");

/* /auth */
router.post(
    "/register",
    validate([
        body("name").trim().notEmpty().withMessage("Name required"),
        body("email").isEmail().withMessage("Valid email required"),
        body("password")
            .isLength({ min: 8 })
            .withMessage("Password must be at least 8 characters"),
    ]),
    C.register
);

router.post(
    "/login",
    validate([
        body("email").isEmail().withMessage("Valid email required"),
        body("password").notEmpty().withMessage("Password required"),
    ]),
    C.login
);

router.get("/me", guard, C.me);
router.post("/logout", C.logout);

module.exports = router;