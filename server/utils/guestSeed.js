const bcrypt = require("bcryptjs");
const User = require("../models/user.js");
const Dev = require("../models/novice.js");

const seedGuestUser = async () => {
    const guestEmail = process.env.GUEST_EMAIL || "guest@example.com";

    let user = await User.findOne({ email: guestEmail });

    if (!user) {
        const hashedPassword = await bcrypt.hash("guest1234", 10);
        user = await User.create({
            firstName: "Guest",
            lastName: "User",
            email: guestEmail,
            password: hashedPassword,
            userType: "Developer",
            profileCompleted: true,
        });

        await Dev.create({
            userId: user._id,
            country: "N/A",
            experience: "None",
            bio: "Guest user profile",
            skills: ["Browsing"],
            languages: ["English"],
            technologies: ["React", "Node.js"],
            interestedJobType: "Any",
            environmentPreference: "Remote",
            portfolio: "https://example.com",
            gitLink: "https://github.com/guest",
        });

        console.log("✅ Guest user seeded");
    } else {
        console.log("ℹ️ Guest user already exists");
    }
};

module.exports = { seedGuestUser };

