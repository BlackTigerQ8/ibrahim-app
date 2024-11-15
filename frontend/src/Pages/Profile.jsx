import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  Paper,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { profileImage, updateUser } from "../redux/userSlice";
import { toast } from "react-toastify";

const Profile = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);

  // Local state for form inputs
  const [formData, setFormData] = useState({
    firstName: userInfo?.firstName || "",
    lastName: userInfo?.lastName || "",
    email: userInfo?.email || "",
    password: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      dispatch(profileImage(file))
        .unwrap()
        .then(() => toast.success("Profile image updated successfully"))
        .catch(() => toast.error("Failed to update profile image"));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUser(formData))
      .unwrap()
      .then(() => toast.success("Profile updated successfully"))
      .catch(() => toast.error("Failed to update profile"));
  };

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 4,
        maxWidth: 600,
        margin: "2rem auto",
      }}
    >
      <Typography variant="h4" gutterBottom textAlign="center">
        Profile
      </Typography>
      <Grid container spacing={3} alignItems="center" justifyContent="center">
        <Grid item>
          <Avatar
            src={selectedImage || userInfo?.profileImage || ""}
            alt="Profile Image"
            sx={{ width: 100, height: 100 }}
          />
        </Grid>
        <Grid item>
          <Button variant="contained" component="label">
            Upload Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
          </Button>
        </Grid>
      </Grid>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ mt: 3 }}
        display="flex"
        flexDirection="column"
        gap={2}
      >
        <TextField
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
          fullWidth
          placeholder="Leave blank to keep the current password"
        />
        <Button type="submit" variant="contained" color="primary">
          Save Changes
        </Button>
      </Box>
    </Paper>
  );
};

export default Profile;
