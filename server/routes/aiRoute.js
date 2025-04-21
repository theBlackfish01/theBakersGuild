const express = require("express");
const aiRouter = express.Router();
const cors = require("cors");
const { generateCoverLetter, generateDevBio, generateComapnyOverview, generateJobDescription } = require("../controllers/aiController");

aiRouter.post("/generate-cover-letter", generateCoverLetter);
aiRouter.post("/generate-dev-bio", generateDevBio);
aiRouter.post("/generate-company-overview", generateComapnyOverview)
aiRouter.post("/generate-job-description", generateJobDescription)


module.exports = aiRouter;
