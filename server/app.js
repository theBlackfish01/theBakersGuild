// server/app.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const authRouter = require("./routes/authRoute");
const recipeRouter = require("./routes/recipeRoute");
const uploadRouter = require("./routes/uploadRoute");
const { errorMiddleware } = require("./middlewares/Error");

const app = express();

app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: process.env.CORS_ORIGINS.split(",").map((s) => s.trim()),
        methods: ["GET", "POST", "PATCH", "DELETE"],
        credentials: true,
    })
);

/* routes */
app.use("/auth", authRouter);
app.use("/recipes", recipeRouter);
app.use("/upload", uploadRouter);

app.use(errorMiddleware);

/* shared Mongo connection (lambda‑safe) */
let cached = null;
async function connectDB() {
    if (cached) return;
    cached = await mongoose.connect(process.env.MONGO_URI);
    console.log("✅  MongoDB connected");
}
connectDB();

module.exports = app;