const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const testRouter = require("./routes/testRoute");  // For testing only
const userRouter = require("./routes/authRoute");
const bakerRouter = require("./routes/bakerRoute");
const devRouter = require("./routes/devRoute");
const jobRouter = require("./routes/jobRoute");
const cookieParser = require("cookie-parser");
const { errorMiddleware } = require("./middlewares/Error.js");
require("dotenv").config(); // Load environment variables
const app = express();
const port = process.env.PORT || 8000;

// Middleware
// Using Middlewares
const corsConfig = {
  credentials: true,
  origin: true,
};
app.use(cors(corsConfig));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  })
);


// Defining Routes

//User Registering Route
app.use("/user", userRouter);

// Handling Company Routes
app.use("/baker", bakerRouter);

// Handling Developer Routes
app.use("/usr", devRouter);

// Handling Job Routes
app.use("/job", jobRouter);

// Handling Test Routes
app.use("/test", testRouter);


// Using Error Middleware
app.use(errorMiddleware);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
      console.log("Connected to Database");
    });
  })
  .catch((error) => {
    console.error(error);
  });