const mongoose = require("mongoose");
const { Schema } = mongoose;

// Company Model
const companySchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    //unique: true,
    required: true,
  },
  website: {
    type: String,
    //unique: true,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  industry: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  overview: {
    type: String,
    required: true,
  },
  workCulture: {
    type: String,
    required: true,
  },
  benefits: {
    type: String,
    required: true,
  },
  myJobs: [
    {
      job: {
        type: Schema.Types.ObjectId,
        ref: "JobPost",
      },
      isPinned: {
        type: Boolean,
        default: false,
      },
      pinnedAt: {
        type: Date,
        default: null,
      },
    },
  ],
});

const companyModel = mongoose.model("Company", companySchema);

module.exports = companyModel;