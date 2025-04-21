const JobPost = require("../models/jobpost");
const Company = require("../models/company");
const Developer = require("../models/dev");
const User = require("../models/user");

//creating a new job post
const createJob = async (req, res) => {
  try {
    // Destructure the required fields from the request body
    console.log("Response From creating JobPost: ", req.body);
    const {
      title,
      description,
      requirement,
      preferredSkills,
      preferredLanguages,
      preferredTechnologies,
      experience,
      jobType,
      environment,
      compensation,
      userId,
    } = req.body;

    console.log("UserId: ",userId)

    // Find the baker based on the userId
    const company = await Company.findOne({ userId });
    console.log("Company: ",company)
    // Create a new job post instance
    const newJobPost = new JobPost({
      title,
      description,
      requirement,
      preferredSkills,
      preferredLanguages,
      preferredTechnologies,
      experience,
      jobType,
      environment,
      compensation,
      postedBy: company._id,
    });

    // Save the new job post to the database
    const savedJobPost = await newJobPost.save();

    // Save the new job in baker's myJobs
    company.myJobs.push({ job: savedJobPost._id });
    await company.save();

    // Send a success response with the ObjectId of the created job post
    res.status(201).json({
      message: "Job post created successfully",
      jobPostId: savedJobPost._id,
    });
  } catch (error) {
    console.error("Error creating job post:", error);
    // Send an error response if an error occurs during job post creation
    res.status(500).json({ message: "Error creating job post" });
  }
};

// Getting All Jobs Data
const getAllJobs = async (req, res) => {

  const { userId } = req.query;

  try {
      // Find the usr based on userId
      const dev = await Developer.findOne({ userId });
      if (!dev) {
          return res.status(404).json({ message: "Developer not found." });
      }

      // Get the job ids for bookmarked, applied, and offered jobs
      const bookmarkedJobIds = dev.myJobs.filter(job => job.isBookmarked).map(job => job.job);
      const appliedJobIds = dev.myJobs.filter(job => job.isApplied).map(job => job.job);
      const acceptedJobIds = dev.myJobs.filter(job => job.isAcceptedOffer).map(job => job.job);
      const offeredJobIds = dev.myJobs.filter(job => job.isOffer).map(job => job.job);
      const rejectedJobIds = dev.myJobs.filter(job => job.isRejectedOffer).map(job => job.job);
      // Fetch all jobs that are bookmarked, applied, or offered
      const bookmarkedJobs = await JobPost.find({
          status: "open",
          _id: { $in: bookmarkedJobIds }
      }).populate('postedBy');

      const appliedJobs = await JobPost.find({
          status: "open",
          _id: { $in: appliedJobIds }
      }).populate('postedBy');

      const offeredJobs = await JobPost.find({
        status: "open",
        _id: { $in: [...offeredJobIds, ...acceptedJobIds, ...rejectedJobIds] }
      }).populate('postedBy');

      console.log("Offered Jobs: ",offeredJobs)

      // Fetch all jobs
      const allJobs = await JobPost.find({ status: "open" }).populate('postedBy');

      res.status(200).json({
          allJobs,
          bookmarkedJobs,
          appliedJobs,
          offeredJobs
      });
  } catch (error) {
      console.error("Error fetching jobs:", error);
      res.status(500).json({ message: "Error fetching jobs" });
  }
};

//Getting Related Jobs Data
const getRelatedJobs = async (req, res) => {
  const { userId, jobId } = req.query;
  
  try {
    // Find the usr based on userId
    const dev = await Developer.findOne({ userId });
    if (!dev) {
      return res.status(404).json({ message: "Developer not found." });
    }

    // Fetch all jobs
    const allJobs = await JobPost.find({ _id: { $ne: jobId }, status: "open" }).populate('postedBy');

    // Extract applicant IDs from applicants array for each job
    const jobApplicantIds = allJobs.map(job => job.applicants.map(applicant => applicant.applicant.toString()));

    // Get the developer's ID as a string
    const devIdString = dev._id.toString();

    // Calculate matching score for each job
    const jobsWithScore = allJobs.map((job, index) => {
      let score = 0;

      // Check if the developer has already applied to this job
      if (jobApplicantIds[index].includes(devIdString)) {
        // Skip this job if the developer has already applied
        return null;
      }

      // Match based on experience
      if (dev.experience >= job.experience) {
        score += 1;
      }

      // Match based on skills
      dev.skills.forEach(skill => {
        if (job.preferredSkills.includes(skill)) {
          score += 1;
        }
      });

      // Match based on languages
      dev.languages.forEach(language => {
        if (job.preferredLanguages.includes(language)) {
          score += 1;
        }
      });

      // Match based on technologies
      dev.technologies.forEach(tech => {
        if (job.preferredTechnologies.includes(tech)) {
          score += 1;
        }
      });

      // Match based on job type
      if (dev.interestedJobType === job.jobType) {
        score += 1;
      }

      // Match based on environment preference
      if (dev.environmentPreference === job.environment) {
        score += 1;
      }

      return {
        ...job.toObject(),
        score
      };
    });

    // Filter out null values (jobs that were skipped)
    const filteredJobsWithScore = jobsWithScore.filter(job => job !== null);

    // Sort the filtered jobs by score in descending order
    const sortedJobs = filteredJobsWithScore.sort((a, b) => b.score - a.score);

    let topJobs = sortedJobs;

    // If no matching jobs were found, send the first three jobs that the developer has not applied to
    if (sortedJobs.length === 0) {
        topJobs = allJobs.filter(job => !jobApplicantIds.flat().includes(devIdString));
    }

    // Send the top three jobs or all sorted jobs if there are fewer than three
    const numJobsToSend = Math.min(topJobs.length, 3);
    const jobsToSend = topJobs.slice(0, numJobsToSend).map(job => {
      // Check if the job is in the developer's myJobs array
      const devJob = dev.myJobs.find(myJob => myJob.job.toString() === job._id.toString());
      const isBookmarked = devJob ? devJob.isBookmarked : false;
    
      return { ...job, isBookmarked };
    });

    res.status(200).json({
      jobsToSend
    });
  } 
  catch (error) 
  {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Error fetching jobs" });
  }
};

// Updating Bookmarks Dashboard
const updateBookmarks = async (req, res) => {
  const { userId, jobId, isBookmarked } = req.body;
  let updatedIsBookmarked;
  if (isBookmarked == true) {
    updatedIsBookmarked = false;
  } else {
    updatedIsBookmarked = true;
  }
  try {
    // Find the developer based on userId
    const developer = await Developer.findOne({ userId });
    if (!developer) {
      return res.status(404).json({ message: "Developer not found." });
    }

    // Find the index of the job in myJobs
    const jobIndex = developer.myJobs.findIndex((job) => job.job.toString() === jobId);

    if (jobIndex !== -1) {
      // If the job is already in myJobs, update its bookmark status
      developer.myJobs[jobIndex].isBookmarked = updatedIsBookmarked;
    } else {
      // If the job is not in myJobs, add it and mark it as bookmarked
      developer.myJobs.push({
        job: jobId,
        isBookmarked: true,
      });
    }

    // Save the updated developer document
    await developer.save();

    res.status(200).json({ message: "Bookmark updated successfully" });
  } catch (error) {
    console.error("Error updating bookmark:", error);
    res.status(500).json({ message: "Error updating bookmark" });
  }
};

//Individual Bookmark
const individualBookmarks = async (req, res) => {
  const { userId, jobId, isBookmarked } = req.body;
  
  try {
    // Find the developer based on userId
    const developer = await Developer.findOne({ userId });
    if (!developer) {
      return res.status(404).json({ message: "Developer not found." });
    }

    // Find the index of the job in myJobs
    const jobIndex = developer.myJobs.findIndex((job) => job.job.toString() === jobId);

    if (jobIndex !== -1) {
      // If the job is already in myJobs, update its bookmark status
      developer.myJobs[jobIndex].isBookmarked = isBookmarked;
    } else {
      // If the job is not in myJobs, add it and mark it as bookmarked
      developer.myJobs.push({
        job: jobId,
        isBookmarked: true,
      });
    }

    // Save the updated developer document
    await developer.save();

    res.status(200).json({ message: "Bookmark updated successfully" });
  } catch (error) {
    console.error("Error updating bookmark:", error);
    res.status(500).json({ message: "Error updating bookmark" });
  }
};

//Accept Job Offer
const acceptOffer = async (req, res) => {
  try {
    const { userId, jobId } = req.body;

    // Find the job post by ID
    const jobPost = await JobPost.findById(jobId);
    // console.log("Jobid received: ", jobId);

    // Find the usr by user ID
    const dev = await Developer.findOne({ userId });
    // console.log("User: ", usr);

    // Update the job post's acceptedApplicants array
    if (!jobPost.acceptedApplicants.includes(dev._id)) {
      // Update the job post's acceptedApplicants array
      jobPost.acceptedApplicants.push(dev._id);
      await jobPost.save();
    }

    // Update the usr's myJobs array
    const jobIndex = dev.myJobs.findIndex((myJob) => myJob.job.toString() === jobId);
    if (jobIndex !== -1) {
      dev.myJobs[jobIndex].isOffer = false;
      dev.myJobs[jobIndex].isAcceptedOffer = true;
      await dev.save();
    }

    res.status(200).json({ success: true, message: "Offer accepted successfully" });
  } catch (error) {
      console.error("Error accepting offer:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//Reject Job Offer

const rejectOffer = async (req, res) => {
  try {
    const { userId, jobId } = req.body;

    // Find the job post by ID
    const jobPost = await JobPost.findById(jobId);

    // Find the usr by user ID
    const dev = await Developer.findOne({ userId });

    // Update the job post's rejectedApplicants array
    if (!jobPost.rejectedApplicants.includes(dev._id)) {
      jobPost.rejectedApplicants.push(dev._id);
      await jobPost.save();
    }

    // Update the usr's myJobs array
    const jobIndex = dev.myJobs.findIndex((myJob) => myJob.job.toString() === jobId);
    if (jobIndex !== -1) {
      dev.myJobs[jobIndex].isOffer = false;
      dev.myJobs[jobIndex].isAcceptedOffer = false;
      dev.myJobs[jobIndex].isRejectedOffer = true;
      await dev.save();
    }

    res.status(200).json({ success: true, message: "Offer rejected successfully" });
  } catch (error) {
      console.error("Error rejecting offer:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//gettingJobApplicants
const getJobApplicants = async (req, res) => {
  const { jobId } = req.query;

  try {
    const jobPost = await JobPost.findById(jobId)
    .populate({
        path: "applicants.applicant",
        model: "Dev",
        select: "userId country experience bio skills languages technologies interestedJobType environmentPreference portfolio gitLink",
    });

    // Extract applicant IDs and cover letters
    const applicantsWithCoverLetters = jobPost.applicants.map(applicant => ({
      applicantId: applicant.applicant._id.toString(),
      coverLetter: applicant.coverLetter,
    }));


    if (!jobPost) {
      return res.status(404).json({ success: false, message: "Job post not found" });
    }

    const allApplicants = await Promise.all(jobPost.applicants.map(async (applicant) => {
      const devData = await Developer.findById(applicant.applicant._id);
      const user = await User.findById(devData.userId);
      return { ...applicant.toObject(),  username: user.firstName + " " + user.lastName };
    }));
    
    const shortlisted = await Promise.all(jobPost.shortlisted.map(async (applicantId) => {
      const devData = await Developer.findById(applicantId);
      const user = await User.findById(devData.userId);
      const coverLetter = applicantsWithCoverLetters.find(applicant => applicant.applicantId === applicantId.toString())?.coverLetter;
      return { applicant: devData, username: user.firstName + " " + user.lastName , coverLetter: coverLetter ,status: true };
    }));

    const rejected = await Promise.all(jobPost.rejectedApplicants.map(async (applicantId) => {
      const devData = await Developer.findById(applicantId);
      const user = await User.findById(devData.userId);
      const coverLetter = applicantsWithCoverLetters.find(applicant => applicant.applicantId === applicantId.toString())?.coverLetter;
      return { applicant: devData, username: user.firstName + " " + user.lastName, coverLetter: coverLetter ,  status: "Rejected" };
    }));

    const accepted = await Promise.all(jobPost.acceptedApplicants.map(async (applicantId) => {
      const devData = await Developer.findById(applicantId);
      const user = await User.findById(devData.userId);
      const coverLetter = applicantsWithCoverLetters.find(applicant => applicant.applicantId === applicantId.toString())?.coverLetter;
      return { applicant: devData, username: user.firstName + " " + user.lastName, coverLetter: coverLetter , status: "Offer Accepted" };
    }));

    const offered = await Promise.all(shortlisted.filter(dev => dev.isOffer).map(async (applicant) => {
      const devData = await Developer.findById(applicant.applicantId); // Assuming you have an applicantId property
      console.log("DevData: ",devData)
      const user = await User.findById(applicant.userId);
      const coverLetter = applicantsWithCoverLetters.find(applicant => applicant.applicantId === applicantId.toString())?.coverLetter;
      return { applicant: devData,  username: user.firstName + " " + user.lastName , coverLetter: coverLetter , status: "Offer Sent" };
    }));

    // const allApplicants = [...accepted, ...shortlisted, ...rejected, ...offered].filter(applicant => applicant !== null);

    // console.log(" All Applicants: ",allApplicants)
    console.log("Shorlitst Jobs: ",shortlisted)

    return res.status(200).json({
      success: true,
      allApplicants,
      shortlisted,
      rejected,
      accepted,
      offered,
    });
  } catch (error) {
    console.error("Error fetching applicants:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//Send Job Offer
const sendJobOffer = async (req, res) => {
  const { jobId, devId } = req.body;
  console.log("Job Id: ", jobId);
  console.log("Dev ID: ", devId);

  try {
      // Update the Developer's isOffered field to true
      const dev = await Developer.findById(devId);
      console.log("Developer: ", dev);

      // Find the job in the developer's myJobs array
      const jobIndex = dev.myJobs.findIndex(job => job.job.toString() === jobId);

      if (jobIndex === -1) {
          return res.status(404).json({ message: "Job not found" });
      }

      // Update the isOffer field for the found job
      dev.myJobs[jobIndex].isOffer = true;
      await dev.save();

      res.status(200).json({ message: "Offer sent successfully" });
  } catch (error) {
      console.error("Error sending offer:", error);
      res.status(500).json({ message: "Error sending offer" });
  }
};

const shortlistToggle = async (req, res) => {
  const { jobId, devId, shortlisted } = req.body;

  try {
    const jobPost = await JobPost.findById(jobId);
    if (!jobPost) {
      return res.status(404).json({ success: false, message: "Job post not found" });
    }

    // Check if the applicant is already in the accepted or rejected applicants list
    if (
      jobPost.acceptedApplicants.includes(devId) ||
      jobPost.rejectedApplicants.includes(devId)
    ) {
      return res.status(400).json({ success: false, message: "Applicant already accepted or rejected" });
    }

    // Update the shortlisted array based on the toggle
    if (shortlisted) {
      if (!jobPost.shortlisted.includes(devId)) {
        jobPost.shortlisted.push(devId);
      }
    } else {
      jobPost.shortlisted = jobPost.shortlisted.filter(id => id.toString() !== devId);
    }

    await jobPost.save();

    return res.status(200).json({ success: true, message: "Shortlist status updated successfully" });
  } catch (error) {
    console.error("Failed to update shortlist status:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


const editJob = async (req, res) => {
  // TODO: update Job info with job_id in req
};

const closeJob = async (req, res) => {
  // TODO: change the Job status with job_id in req to "closed" and set isPinned=False, pinnedAt=null in baker's myJobs array
  try {
    const { userId, myJobId, jobId } = req.body;
    const company = await Company.findOne({ userId: userId });
    const job = await JobPost.findOne({ _id: jobId });

    // Check if baker and job are found
    if (!company || !job) {
      return res.status(404).json({ message: "Company or job not found" });
    }

    // Change the Job status to "closed"
    job.status = "closed";
    await job.save();

    // Update the job in baker's myJobs
    company.myJobs = company.myJobs.map((job) => {
      if (job._id.toString() === myJobId) {
        job.isPinned = false;
        job.pinnedAt = null;
      }
      return job;
    });

    await company.save();

    res.status(200).json({ message: "Job closed successfully" });
  } catch (error) {
    console.error("Error closing job:", error);
    res.status(500).json({ message: "Error closing job" });
  }
};

const deleteJob = async (req, res) => {
  const {userId} = req.query;
  try {
    // Use deleteMany to remove documents where the field matches the identifier
    const result = await JobPost.deleteMany({ postedBy: userId });

    res.status(200).json({ message: `${result.deletedCount} documents deleted` });
  } catch (error) {
    console.error("Error deleting users:", error);
    res.status(400).json({ error: error.message });
  }
};

const deleteApplicants = async (req, res) => {
  const {userId} = req.query;
  try {
    const result = await JobPost.updateMany(
      {},
      {
        $pull: {
          applicants: {applicant : userId }, 
          shortlisted: userId 
        }
      }
    );
    res.status(200).json({ message: "Documents updated" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { createJob, getAllJobs, editJob, closeJob, deleteJob,updateBookmarks, individualBookmarks, getRelatedJobs, deleteApplicants,acceptOffer ,rejectOffer , getJobApplicants, sendJobOffer , shortlistToggle};
