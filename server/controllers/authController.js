// server/controllers/authController.js
const Baker = require("../models/Baker");
const { sign } = require("../utils/jwt");

const cookieOpts = {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 2, // 2 h
};

/* register */
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, bio = "", questions = {} } = req.body;

        const exists = await Baker.findOne({ email });
        if (exists) return res.status(400).json({ message: "Email already used" });

        const baker = await Baker.create({ name, email, password, bio, questions });
        const token = sign(baker._id);

        res.cookie("token", token, cookieOpts);
        res.status(201).json({ baker: { _id: baker._id, name: baker.name, email } });
    } catch (err) {
        next(err);
    }
};

/* login */
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const baker = await Baker.findOne({ email });
        if (!baker || !(await baker.correctPassword(password)))
            return res.status(400).json({ message: "Wrong credentials" });

        const token = sign(baker._id);
        res.cookie("token", token, cookieOpts);
        res.json({ baker: { _id: baker._id, name: baker.name, email } });
    } catch (err) {
        next(err);
    }
};

/* me */
exports.me = (req, res) =>
    res.json({ baker: { _id: req.baker._id, name: req.baker.name, email: req.baker.email } });

/* logout */
exports.logout = (_req, res) => {
    res.clearCookie("token");
    res.status(204).end();
};