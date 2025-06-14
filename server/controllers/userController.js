const bcrypt = require("bcrypt");
const jwt    = require("jsonwebtoken");
const User   = require("../models/user");

/* ---------- helper ---------- */
function signToken(id) {
  return jwt.sign({ userId: id }, process.env.JWT_SECRET, { expiresIn: "1h" });
}

function publicUser(u) {
  const { _id, firstName, lastName, email, userType } = u;
  return { _id, firstName, lastName, email, userType };
}

/* ---------- register ---------- */
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, userType } = req.body;

    /* basic validation (kept from your original code, trimmed) */
    const missing = [firstName && "firstName", lastName && "lastName",
      email && "email", password && "password",
      userType && "userType"].filter(Boolean);
    if (missing.length < 5)
      return res.status(400).json({ success:false, field:"general",
        message:`${missing.filter(x=>!x).join(", ")} required` });

    /* check e-mail duplication */
    if (await User.findOne({ email }))
      return res.status(400).json({ success:false, field:"email",
        message:"Email already registered" });

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstName, lastName, email, password: hashed, userType,
    });

    const token = signToken(newUser._id);

    res.status(201).json({
      success: true,
      user   : publicUser(newUser),
      userId : newUser._id,
      userType: newUser.userType,
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success:false, message:"Internal server error" });
  }
};

/* ---------- login ---------- */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const valid = user && (await bcrypt.compare(password, user.password));

    if (!valid)
      return res.status(200).json({ success:false,
        message:"Invalid email or password" });

    const token = signToken(user._id);

    res.json({
      success: true,
      user   : publicUser(user),
      userId : user._id,
      userType: user.userType,
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success:false, message:"Internal server error" });
  }
};

/* ---------- guest login ---------- */
const loginGuest = async (_req, res) => {
  try {
    const guestEmail = process.env.GUEST_EMAIL || "guest@example.com";
    const user = await User.findOne({ email: guestEmail });

    if (!user) return res.status(404).json({ message:"Guest not found" });

    const token = signToken(user._id);

    res.json({
      success: true,
      user   : publicUser(user),
      userId : user._id,
      userType: user.userType,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------- change password (now secure) ---------- */
const changePassword = async (req, res) => {
  const { currentPassword, newPassword, userId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success:false,
      message:"User not found" });

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) return res.status(400).json({ success:false,
      message:"Current password incorrect" });

    if (await bcrypt.compare(newPassword, user.password))
      return res.status(400).json({ success:false,
        message:"New password must differ from old one" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({ success:true, message:"Password updated" });
  } catch (err) {
    res.status(500).json({ success:false, message: err.message });
  }
};

/* ---------- delete user (unchanged) ---------- */
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.query;
    const deleted = await User.findByIdAndDelete(userId);
    if (!deleted) return res.status(404).json({ message:"User not found" });
    res.json({ message:"User deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
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

module.exports = {
  registerUser,
  loginUser,
  loginGuest,
  changePassword,
  deleteUser,
  getUser,
  editUser
};




