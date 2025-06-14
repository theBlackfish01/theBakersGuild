const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName : { type: String, required: true },
  email    : { type: String, unique: true, required: true },
  password : { type: String, required: true },
  userType : { type: String, required: true, enum: ["Developer", "Company"] },
  profileCompleted: { type: Boolean, default: false },
});

module.exports =
    mongoose.models.User ?? mongoose.model("User", userSchema);
