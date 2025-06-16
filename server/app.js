// ────────────────────────────
// File: server/app.js
// Core Express app (local + Vercel)
// ────────────────────────────
const express       = require("express");
const mongoose      = require("mongoose");
const cors          = require("cors");
const cookieParser  = require("cookie-parser");
require("dotenv").config();

const authRouter    = require("./routes/authRoute");
const recipeRouter  = require("./routes/recipeRoute");
const { errorMiddleware } = require("./middlewares/Error");

const app = express();

/* global middleware */
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: (process.env.FRONTEND_URL ?? "").split(",").map(s => s.trim()),
        methods: ["GET","POST","PATCH","DELETE"],
        credentials: true,
    })
);

/* routes */
app.use("/auth",    authRouter);   // register / login Bakers
app.use("/recipes", recipeRouter); // public browsable, auth-protected mutations

app.use(errorMiddleware);

/* shared Mongo connection (lambda-safe) */
let cached = null;
async function connectDB() {
    if (cached) return;
    cached = await mongoose.connect(process.env.MONGO_URI);
    console.log("✅  MongoDB connected");
}
connectDB();

module.exports = app;
