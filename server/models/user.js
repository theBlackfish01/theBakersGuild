const mongoose = require("mongoose");
const { Schema } = mongoose;

//User Model
const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    required: true,
    enum: ["Developer", "Company"], // Define possible user types
  },
  profileCompleted: {
    type: Boolean,
    default: false,
  },
});

let UserModel;
if (mongoose.models.User) {
  UserModel = mongoose.model('User');
} else {
  UserModel = mongoose.model('User', userSchema);
}

module.exports = UserModel;
