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
import { useTranslation } from "react-i18next";

const Profile = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const { t, i18n } = useTranslation();
  const currentUser = useSelector((state) => state.user.userInfo);

  // Local state for form inputs
  const [formData, setFormData] = useState({
    firstName: t(userInfo?.firstName || ""),
    lastName: t(userInfo?.lastName || ""),
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
        margin: { xs: ".5rem", sm: "2rem auto" },
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        gap={2}
        sx={{ flexDirection: { xs: "column", sm: "row" } }}
      >
        <Grid spacing={3} alignItems="center">
          <Grid item>
            <Avatar
              src={selectedImage || userInfo?.profileImage || ""}
              alt="Profile Image"
              sx={{ width: 100, height: 100 }}
            />
          </Grid>
          <Grid item>
            <Button variant="contained" component="label">
              {t("uploadImage")}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
          </Grid>
        </Grid>
        <Box display="flex" flexDirection="column">
          <Typography variant="h2" gutterBottom textAlign="center">
            {t(currentUser.role)}
          </Typography>
          <Box display="flex" justifyContent="center" gap={1}>
            <Typography variant="h4">{t(currentUser.firstName)}</Typography>
            <Typography variant="h4">{t(currentUser.lastName)}</Typography>
          </Box>
        </Box>
      </Box>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ mt: 3 }}
        display="flex"
        flexDirection="column"
        gap={2}
      >
        <TextField
          label={t("firstName")}
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label={t("lastName")}
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label={t("email")}
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label={t("password")}
          name="password"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
          fullWidth
          placeholder={t("leaveBlankPassword")}
        />
        <Button type="submit" variant="contained" color="primary">
          {t("saveChanges")}
        </Button>
      </Box>
    </Paper>
  );
};

export default Profile;
