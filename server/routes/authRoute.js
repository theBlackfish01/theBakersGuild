const express = require("express");
const router = express.Router();
const cors = require("cors");
const {
    registerUser,
    loginUser,
    getUser,
    editUser,
    changePassword,
    deleteUser,
    loginGuest
} = require("../controllers/userController");

// All the routes defined
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getUser", getUser);
router.patch("/editUser", editUser);
router.patch("/changePassword", changePassword);
router.delete("/deleteUser", deleteUser);
router.post("/guest", loginGuest);

module.exports = router;
