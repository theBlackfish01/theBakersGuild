const express = require("express");
const router = express.Router();
const cors = require("cors");
const { registerUser, loginUser, getUser, editUser, changePassword, deleteUser } = require("../controllers/userController");

// All the routes Defined
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getUser", getUser)
router.patch("/editUser/", editUser)
router.patch("/changePassword", changePassword)
router.delete("/deleteUser", deleteUser)

module.exports = router;
