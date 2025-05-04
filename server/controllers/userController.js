const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

// Registering a New User
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, userType } = req.body;

    const emptyFields = [];

    // Check if any required field is missing
    if (!firstName) {
      emptyFields.push("firstName");
    }
    if (!lastName) {
      emptyFields.push("lastName");
    }
    if (!email) {
      emptyFields.push("email");
    }
    if (!password) {
      emptyFields.push("password");
    }
    if (!userType) {
      emptyFields.push("userType");
    }

    if (emptyFields.length > 0) {
      let errorMessage =
        emptyFields.length === 1
          ? `${emptyFields[0]} is required.`
          : `${emptyFields.join(", ")} are required.`;
      return res
        .status(400)
        .json({ success: false, field: "general", message: errorMessage });
    }

    // Check if first name contains only letters and is not empty
    if (!/^[a-zA-Z]+$/.test(firstName.trim())) {
      return res.status(400).json({
        success: false,
        field: "firstName",
        message: "First name must contain only letters.",
      });
    }

    // Check if last name contains only letters and is not empty
    if (!/^[a-zA-Z]+$/.test(lastName.trim())) {
      return res.status(400).json({
        success: false,
        field: "lastname",
        message: "Last name must contain only letters.",
      });
    }

    // Regular expression for password validation
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&_^])[A-Za-z\d@$!%*#?&_^]{8,}$/;

    // Validate password
    if (!passwordRegex.test(password)) {
      let errorMessage = "Password must ";
      if (password.length < 8) {
        errorMessage += "be at least 8 characters long ";
      }
      else if (!/(?=.*[a-z])/.test(password)) {
        errorMessage += "contain at least one lowercase letter ";
      }
      else if (!/(?=.*[A-Z])/.test(password)) {
        errorMessage += "contain at least one uppercase letter ";
      }
      else if (!/(?=.*\d)/.test(password)) {
        errorMessage += "contain at least one number ";
      }
      else if (!/(?=.*[@$!%*#?&_^])/.test(password)) {
        errorMessage += "contain at least one special character ";
      }
      return res.status(400).json({
        success: false,
        field: "password",
        message: errorMessage.trim(),
      });
    }

    // Check if email is valid
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        field: "email",
        message: "Invalid email address.",
      });
    }

    //Hashing and Bycrypting the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //Check exsiting user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        field: "email",
        message: "Email address is already registered.",
      });
    }

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      userType,
    });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });


    res
      .status(201)
      .json({ success: true, message: "User registered successfully." , user: newUser , user: {userId: newUser._id , token : token} });
  } catch (error) {
    console.log("Here");
    console.error("Error registering user:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(200)
        .json({ success: false, message: "Invalid email or password." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(200)
        .json({ success: false, message: "Invalid email or password." });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ success: true, userType: user.userType, userId: user._id , user: {userId: user._id , token : token} });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

const loginGuest = async (req, res) => {
  try {
    const guestEmail = process.env.GUEST_EMAIL || "guest@example.com";
    const user = await User.findOne({ email: guestEmail });

    if (!user) return res.status(404).json({ message: "Guest user not found" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      success: true,
      userType: user.userType,
      userId: user._id,
      user: {
        userId: user._id,
        token: token,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUser = async (req, res) => {
  const {userId} = req.query;
  try {
    const user = await User.findById(userId);
    console.log
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// update user info 
const editUser = async (req, res) => {
  const {
    firstName,
    lastName,
    email
  } = req.body;

  const { id } = req.params;
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: id }, // Filter: Find the user by its ID
      {
        firstName,
        lastName,
        email
      }, // Update
      { new: true } // Options: Return the updated document
    );

    // If the baker doesn't exist, return 404
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const changePassword = async (req, res) => {
  console.log("In here")
  const {passwordCheck, currentPassword, newPassword , userId} = req.body;
  console.log("UserId: ",userId)
  console.log("Current Password: ",currentPassword)
  console.log("new  Password: ",newPassword)
  // Function to compare passwords
  const comparePasswords = (passwordCheck, currentPassword) => {
    return new Promise((resolve, reject) => {
      bcrypt.compare(passwordCheck, currentPassword, function(err, result) {
        if (err) {
          // Handle error
          reject(err);
          return;
        }
        if (result) {
          // Passwords match
          resolve(true);
        } else {
          // Passwords don't match
          resolve(false);
        }
      });
    });
  };
  const passwordsMatch = await comparePasswords(passwordCheck, currentPassword);
  if(passwordsMatch===false) {
    return res.json({
      success: false,
      field: "password",
      message: "Entered password does not match current password",
    });
  }
  if (newPassword===passwordCheck) {
    return res.json({
      success: false,
      field: "password",
      message: "New password must be different from old password"
    });
  }
  // Regular expression for password validation
  const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&_^])[A-Za-z\d@$!%*#?&_^]{8,}$/;
  // Validate password
  if (!passwordRegex.test(newPassword)) {
  let errorMessage = "Password must ";
  if (newPassword.length < 8) {
    errorMessage += "be at least 8 characters long ";
  }
  else if (!/(?=.*[a-z])/.test(newPassword)) {
    errorMessage += "contain at least one lowercase letter ";
  }
  else if (!/(?=.*[A-Z])/.test(newPassword)) {
    errorMessage += "contain at least one uppercase letter ";
  }
  else if (!/(?=.*\d)/.test(newPassword)) {
    errorMessage += "contain at least one number ";
  }
  else if (!/(?=.*[@$!%*#?&_^])/.test(newPassword)) {
    errorMessage += "contain at least one special character ";
  }
  return res.json({
    success: false,
    field: "password",
    message: errorMessage.trim(),
  });
  }
  //Hashing and Bycrypting the password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId }, // Filter: Find the user by its ID
      {password: hashedPassword}, // Update
      { new: true } // Options: Return the updated document
    );

    // If the baker doesn't exist, return 404
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const deleteUser = async (req, res) => {
  const {userId} = req.query;
  try {
    // Use findByIdAndDelete to find and delete the user by id
    const deletedUser = await User.findByIdAndDelete(userId);
    
    if (!deletedUser) {
      // If no user found with the given id, return appropriate message or handle accordingly
      return res.status(404).json({ error: "User not found" });
    }
    
    // Return success message or any relevant data
    return res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    // Handle errors
    return res.status(400).json({ error: error.message });
  }
}

module.exports = { registerUser, loginUser, getUser, editUser, changePassword, deleteUser, loginGuest};
