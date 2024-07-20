const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  jobTitle: {
    type: String,
    required: true,
  },
  applicationStatus: {
    type: String,
    enum: ["Applied", "Interviewing", "Offer", "Rejected"],
    required: true,
    default: "Applied",
  },
  applicationDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  followUpDate: {
    type: Date,
  },
  notes: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
});

module.exports = mongoose.model("jobApplication", jobApplicationSchema);
