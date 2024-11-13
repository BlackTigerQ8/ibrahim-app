const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const userRouter = require("./routes/userRoutes");

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

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "Ok", timestamp: new Date().toISOString() });
});

module.exports = app;
