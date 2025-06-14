const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const testRouter = require("./routes/testRoute");
const userRouter = require("./routes/authRoute");
const bakerRouter = require("./routes/bakerRoute");
const devRouter = require("./routes/noviceRoute");
const recipeRouter = require("./routes/recipeRoute");
const cookieParser = require("cookie-parser");
const { errorMiddleware } = require("./middlewares/Error.js");
const { seedGuestUser } = require("./utils/guestSeed.js"); // <-- Add guest seed
require("dotenv").config();
const app = express();
const port = process.env.PORT || 8000;

app.use(
    cors({
        origin: [process.env.FRONTEND_URL],   // <- set in Step 3
        methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: [process.env.FRONTEND_URL],
        methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
        credentials: true,
    })
);

app.use("/user", userRouter);
app.use("/baker", bakerRouter);
app.use("/novice", devRouter);
app.use("/job", recipeRouter);
app.use("/test", testRouter);
app.use(errorMiddleware);

mongoose
    .connect(process.env.MONGO_URI)
    .then(async () => {
        await seedGuestUser(); // <-- Seed guest on server start
        app.listen(port, () => {
            console.log(`Listening on port ${port}`);
            console.log("Connected to Database");
        });
    })
    .catch((error) => {
        console.error(error);
    });