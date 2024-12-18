import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  useTheme,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
  Avatar,
  IconButton,
} from "@mui/material";
import Title from "../components/Title";
import { tokens } from "../theme";
// import { NewtonsCradle } from "@uiball/loaders";
import useMediaQuery from "@mui/material/useMediaQuery";
import { PhotoCamera } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
// import { trefoil } from "ldrs";
import { pulsar } from "ldrs";
import { ErrorMessage, Formik } from "formik";
import { fetchUsers, updateUser } from "../redux/usersSlice";
import { useParams } from "react-router-dom";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";

const UserProfile = () => {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const userInfo = useSelector((state) => state.user.userInfo);
  const { status, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const params = useParams();
  const token =
    useSelector((state) => state.user.token) || localStorage.getItem("token");
  const [profileImage, setProfileImage] = useState(userInfo?.image || "");

  useEffect(() => {
    dispatch(fetchUsers(token));
  }, [token]);

  const initialValues = userInfo || {
    firstName: userInfo?.firstName || "",
    lastName: userInfo?.lastName || "",
    phone: userInfo?.phone || "",
    email: userInfo?.email || "",
    image: "",
    role: userInfo?.role || "",
    passport: userInfo?.passport || "",
    password: "",
    createdAt: userInfo?.createdAt || new Date(),
  };

  const validationSchema = Yup.object().shape({
    image: Yup.mixed().test(
      "fileType",
      "Only image files are allowed",
      (value) => {
        if (!value) return true;
        return (
          value && ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
        );
      }
    ),
  });

  pulsar.register();
  if (status === "loading") {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <l-pulsar
          size="70"
          speed="1.75"
          color={colors.greenAccent[500]}
        ></l-pulsar>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
        }}
      >
        Error: {error}
      </div>
    );
  }

  const handleFormSubmit = async (values) => {
    try {
      if (userInfo && userInfo._id) {
        const formData = new FormData();

        // Include updated image if changed
        if (profileImage instanceof File) {
          formData.append("image", profileImage);
        }

        // Only include changed values
        Object.keys(values).forEach((key) => {
          if (values[key] !== initialValues[key] && key !== "__v") {
            formData.append(key, values[key]);
          }
        });

        // Handle password separately
        if (values.password && values.password.trim() !== "") {
          formData.append("password", values.password);
        }

        // Convert email to lowercase
        if (values.email) {
          formData.set("email", values.email.toLowerCase());
        }

        await dispatch(updateUser({ userId: userInfo._id, formData })).unwrap();
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);

      // Optional: Update the preview
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box sx={{ margin: "0 1rem" }}>
      <Title
        title={t("userProfileTitle")}
        subtitle={t("userProfileSubtitle")}
      />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={validationSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <Box
                sx={{
                  gridColumn: "span 4",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <Avatar
                  src={
                    profileImage instanceof File
                      ? URL.createObjectURL(profileImage)
                      : profileImage
                  }
                  alt="Profile"
                  sx={{
                    width: 120,
                    height: 120,
                    marginBottom: "10px",
                    border: `2px solid ${colors.primary[500]}`,
                  }}
                />
                <IconButton
                  color="secondary"
                  aria-label="upload picture"
                  component="label"
                >
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={handleImageChange}
                  />
                  <PhotoCamera />
                </IconButton>
              </Box>
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label={t("firstName")}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.firstName}
                name="firstName"
                error={!!touched.firstName && !!errors.firstName}
                helperText={touched.firstName && errors.firstName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label={t("lastName")}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.lastName}
                name="lastName"
                error={!!touched.lastName && !!errors.lastName}
                helperText={touched.lastName && errors.lastName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label={t("email")}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label={t("phone")}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.phone}
                name="phone"
                error={!!touched.phone && !!errors.phone}
                helperText={touched.phone && errors.phone}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label={t("password")}
                onBlur={handleBlur}
                onChange={handleChange}
                // value={values.password}
                name="password"
                error={!!touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label={t("createdAt")}
                onBlur={handleBlur}
                onChange={handleChange}
                value={
                  values.createdAt
                    ? new Date(values.createdAt).toISOString().split("T")[0]
                    : ""
                }
                name="createdAt"
                disabled
                error={!!touched.createdAt && !!errors.createdAt}
                helperText={touched.createdAt && errors.createdAt}
                sx={{ gridColumn: "span 2" }}
              />

              <FormControl
                fullWidth
                variant="filled"
                sx={{ gridColumn: "span 2" }}
              >
                <InputLabel htmlFor="role">{t("role")}</InputLabel>
                <Select
                  label="role"
                  value={values.role}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="role"
                  disabled
                  error={!!touched.role && !!errors.role}
                  helperText={touched.role && errors.role}
                >
                  {/* <MenuItem value={"Admin"}>Admin</MenuItem> */}
                  <MenuItem value={"Coach"}>{t("Coach")}</MenuItem>
                  <MenuItem value={"Athlete"}>{t("Athlete")}</MenuItem>
                  <MenuItem value={"Family"}>{t("Family")}</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                fullWidth={!isNonMobile}
                sx={{
                  fontSize: "16px",
                  marginBottom: "1rem",
                  minWidth: isNonMobile ? "120px" : "100%",
                }}
              >
                {t("update")}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default UserProfile;
