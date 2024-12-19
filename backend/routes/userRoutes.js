const express = require("express");
const {
  getAllusers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  logoutUser,
} = require("../controllers/userController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

const router = express.Router();

router
  .route("/")
  .get(protect, restrictTo("Admin", "Coach"), getAllusers)
  .post(protect, restrictTo("Admin"), createUser);

router
  .route("/:id")
  .get(protect, getUser)
  .patch(protect, updateUser)
  .delete(protect, restrictTo("Admin"), deleteUser);

router.post("/login", loginUser);
router.post("/logout", protect, logoutUser);

module.exports = router;
