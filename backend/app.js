const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const userRouter = require("./routes/userRoutes");
const categoryRouter = require("./routes/categoryRoutes.js");
const trainingRoutes = require("./routes/trainingRoutes");
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
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// app.get("/api/health", (req, res) => {
//   res.status(200).json({ status: "Ok", timestamp: new Date().toISOString() });
// });

module.exports = app;
