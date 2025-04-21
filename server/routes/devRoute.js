const express = require("express");
const devRouter = express.Router();
const cors = require("cors");
const { devRegister, devEdit, devApplication, getDev, deleteDev } = require("../controllers/devController");

devRouter.post("/profileSetup", devRegister);
devRouter.patch("/profileEdit", devEdit);
devRouter.post("/application",devApplication)
devRouter.get("/getProfile", getDev)
devRouter.delete("/deleteDev", deleteDev)

module.exports = devRouter;
