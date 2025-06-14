const express = require("express");
const testRouter = express.Router();

// models
const User = require("../models/user");
const Dev = require("../models/novice");
const Company = require("../models/baker");
const Job = require("../models/recipePost");

// CAUTION !!!

testRouter.get("/123", async (req, res) => {
  try {
    // Fetch all jobs
    const jobs = await Job.find();

    // Iterate over each job
    for (let job of jobs) {
      // Get the baker who posted the job
      const company = await Company.findById(job.postedBy);

      // Update the baker's myJobs[] with the job _id
      company.myJobs.push({ job: job._id });

      // Save the updated baker
      await company.save();
    }

    res.status(200).json({ message: "Companies updated successfully" });
  } catch (error) {
    console.error("Error updating jobs:", error);
    res.status(500).json({ message: "An error occurred while updating jobs" });
  }
});

module.exports = testRouter;

