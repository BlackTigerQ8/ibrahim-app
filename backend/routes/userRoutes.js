const express = require("express");
const {
  getAllusers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  logoutUser,
  verifyEmail,
  contactMessage,
} = require("../controllers/userController");
const { protect, restrictTo } = require("../middleware/authMiddleware");
const { profileImageUpload } = require("./uploadRoutes");

const router = express.Router();

router
  .route("/")
  .get(protect, getAllusers)
  .post(
    protect,
    restrictTo("Admin"),
    profileImageUpload.single("image"),
    createUser
  );

router
  .route("/:id")
  .get(protect, getUser)
  .patch(protect, profileImageUpload.single("image"), updateUser)
  .delete(protect, restrictTo("Admin"), deleteUser);

router.post("/login", loginUser);
router.post("/logout", protect, logoutUser);

router.get("/verify-email/:token", verifyEmail);

router.post("/contact", contactMessage);

module.exports = router;
