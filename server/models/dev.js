const mongoose = require("mongoose");
const { Schema } = mongoose;
const devProfile = require("../models/dev");

//Dev Model
const devSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  country: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  skills: {
    type: [String],
    required: true,
  },
  languages: {
    type: [String],
    required: true,
  },
  technologies: {
    type: [String],
    required: true,
  },
  interestedJobType: {
    type: String,
    required: true,
  },
  environmentPreference: {
    type: String,
    required: true,
  },
  portfolio: {
    type: String,
    required: true,
  },
  gitLink: {
    type: String,
    required: true,
  },
  myJobs : [{
    job: {
      type: Schema.Types.ObjectId,
      ref: 'JobPost'
    },
    isBookmarked: {
      type: Boolean,
      default: false
    },
    isOffer: {
      type: Boolean,
      default: false
    },
    isAcceptedOffer: {
      type: Boolean,
      default: false
    },
    isRejectedOffer: {
      type: Boolean,
      default: false
    },
    isApplied: {
      type: Boolean,
      default: false
    },
    coverLetter: {
      type: String,
    },
  }],
});

const devModel = mongoose.model("Dev", devSchema);

module.exports = devModel;
