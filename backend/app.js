const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const userRouter = require("./routes/userRoutes");
const categoryRouter = require("./routes/categoryRoutes.js");
const trainingRoutes = require("./routes/trainingRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const path = require("path");

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

///// MIDDLEWARE /////
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use("/api/users", userRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/trainings", trainingRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

module.exports = app;
