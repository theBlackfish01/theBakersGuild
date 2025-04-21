const express = require("express");
const jobRouter = express.Router();
const cors = require("cors");
const {
  createJob,
  getAllJobs,
  getRelatedJobs,
  individualBookmarks,
  editJob,
  closeJob,
  deleteJob,
  updateBookmarks,
  deleteApplicants,
  acceptOffer,
  rejectOffer,
  getJobApplicants,
  sendJobOffer,
  shortlistToggle
  
} = require("../controllers/jobController");

jobRouter.post("/create", createJob);
jobRouter.get("/all", getAllJobs);
jobRouter.get("/related",getRelatedJobs)
jobRouter.patch("/edit", editJob);
jobRouter.patch("/close", closeJob);
jobRouter.delete("/delete", deleteJob);
jobRouter.delete("/deleteApplicant", deleteApplicants)
jobRouter.put("/updateBookmarks",updateBookmarks)
jobRouter.put("/toggleStatus",shortlistToggle)
jobRouter.put("/individualBookmarks",individualBookmarks)
jobRouter.post("/acceptOffer",acceptOffer)
jobRouter.post("/rejectOffer",rejectOffer)
jobRouter.get("/getJobApplicants",getJobApplicants)
jobRouter.post("/sendJobOffer",sendJobOffer)

module.exports = jobRouter;
