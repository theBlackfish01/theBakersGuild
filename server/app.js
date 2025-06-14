/* Core Express app – shared by local server and Vercel functions */
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const testRouter = require("./routes/testRoute");
const userRouter = require("./routes/authRoute");
const bakerRouter = require("./routes/bakerRoute");
const devRouter   = require("./routes/noviceRoute");
const recipeRouter = require("./routes/recipeRoute");
const { errorMiddleware } = require("./middlewares/Error");
const { seedGuestUser }  = require("./utils/guestSeed");
require("dotenv").config();

const app = express();

/* ---------- global middleware ---------- */
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        /* allow localhost during dev, Vercel domain in prod */
        origin: process.env.FRONTEND_URL?.split(",") ?? true,
        methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
        credentials: true,
    })
);

/* ---------- routes ---------- */
app.use("/user",   userRouter);
app.use("/baker",  bakerRouter);
app.use("/novice", devRouter);
app.use("/job",    recipeRouter);
app.use("/test",   testRouter);
app.use(errorMiddleware);

/* ---------- Mongo connection (cached in Lambda) ---------- */
let cached = null;
async function connectDB() {
    if (cached) return;
    cached = await mongoose.connect(process.env.MONGO_URI);
    await seedGuestUser();
    console.log("✅  MongoDB connected");
}
connectDB();

module.exports = app;          // 🎯 ← the Express handler itself
