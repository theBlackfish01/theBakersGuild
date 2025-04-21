const mongoose = require("mongoose");
const { Schema } = mongoose;

const JobPostSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  requirement: {
    type: String,
    required: true,
  },
  preferredSkills: {
    type: [String],
    default: [],
  },
  preferredLanguages: {
    type: [String],
    default: [],
  },
  preferredTechnologies: {
    type: [String],
    default: [],
  },
  experience: {
    type: String,
    required: true,
  },
  jobType: {
    type: String,
    required: true,
  },
  environment: {
    type: String,
    required: true,
  },
  compensation: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "open",
  },
  datePosted: {
    type: Date,
    default: Date.now(),
  },
  postedBy: {
    type: Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  applicants: [{
    applicant: {
      type: Schema.Types.ObjectId,
      ref: 'Dev',
    },
    coverLetter: {
      type: String,
    },
  }],
  acceptedApplicants: [{
    type: Schema.Types.ObjectId,
    ref: "Dev",
  }],
  rejectedApplicants: [{
    type: Schema.Types.ObjectId,
    ref: 'Dev',
  }],
  shortlisted: [{
    type: Schema.Types.ObjectId,
    ref: 'Dev',
  }],
  offered : [{
    type: Schema.Types.ObjectId,
    ref: 'Dev',
  }]
  
});

const JobPost = mongoose.model("JobPost", JobPostSchema);

module.exports = JobPost;
