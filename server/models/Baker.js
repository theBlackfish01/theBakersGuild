// ────────────────────────────
// File: server/models/Baker.js
// ────────────────────────────
const mongoose = require("mongoose");
const bcrypt   = require("bcrypt");
const { Schema } = mongoose;

const bakerSchema = new Schema(
    {
      name:        { type: String, required: true, trim: true },
      email:       { type: String, required: true, unique: true, lowercase: true },
      password:    { type: String, required: true, minlength: 8 },
      bio:         { type: String, default: "" },
      questions:   { type: Schema.Types.Mixed, default: {} }, // flexible key-value
    },
    { timestamps: true }
);

/* one-liner password hash */
bakerSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

/* auth helper (instance method) */
bakerSchema.methods.correctPassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.models.Baker ?? mongoose.model("Baker", bakerSchema);
