import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import { fetchUsers, updateUser } from "../../redux/usersSlice";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { tokens } from "../../theme";
import Title from "../../components/Title";
import Avatar from "../../assets/avatar.jpg";

const UserProfile = () => {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { id } = useParams();
  const users = useSelector((state) => state.users.users ?? []);
  const userInfo = users.find((user) => user._id === id);
  const { status, error } = useSelector((state) => state.user);
  const API_URL = process.env.REACT_APP_API_URL;

  const token =
    useSelector((state) => state.user.token) || localStorage.getItem("token");
  const [profileImage, setProfileImage] = useState(userInfo?.image || "");

  useEffect(() => {
    if (token) dispatch(fetchUsers(token));
  }, [token]);

  const initialValues = userInfo || {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    image: "",
    role: "",
    password: "",
    createdAt: "",
  };

  useEffect(() => {
    if (userInfo?.image) setProfileImage(`${API_URL}/${userInfo.image}`);
  }, [userInfo]);

  const validationSchema = Yup.object({
    image: Yup.mixed().test(
      "fileType",
      t("onlyImagesAllowed"),
      (value) =>
        !value || ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
    ),
  });

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && ["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      setProfileImage(file);
    } else {
      console.error(t("invalidImageType"));
    }
  };

  const handleFormSubmit = async (values) => {
    // if (!userInfo || !userInfo._id) return;
    //

    console.log("IN handleFormSubmit", values);
    const formData = new FormData();

    // Check if the profileImage is a valid File object and append it to FormData
    if (profileImage instanceof File) {
      formData.append("image", profileImage);
    }

    Object.entries(values).forEach(([key, value]) => {
      if (value !== initialValues[key] && key !== "__v") {
        formData.append(key, key === "email" ? value.toLowerCase() : value);
      }
    });

    try {
      await dispatch(
        updateUser({
          userId: userInfo._id,
          formData,
        })
      ).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  if (status === "loading") {
    return (
      <Box
        display="flex"
        f
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <l-pulsar
          size="70"
          speed="1.75"
          color={colors.greenAccent[500]}
        ></l-pulsar>
      </Box>
    );
  }

  if (status === "failed") {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        fontSize="18px"
      >
        Error: {error}
      </Box>
    );
  }

  return (
    <Box sx={{ margin: "0 1rem" }}>
      <Title
        title={t("userProfileTitle")}
        subtitle={t("userProfileSubtitle")}
      />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
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
                gridColumn="span 4"
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
              >
                <img
                  crossorigin="anonymous"
                  src={
                    profileImage
                      ? profileImage instanceof File
                        ? URL.createObjectURL(profileImage)
                        : profileImage
                      : Avatar
                  }
                  alt={t("profileImage")}
                  style={{
                    width: 200,
                    height: 200,
                    marginBottom: "16px",
                    borderRadius: "50%",
                    border: `2px solid ${colors.secondary.main}`,
                  }}
                />

                <IconButton color="secondary" component="label">
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={handleImageUpload}
                  />
                  <PhotoCamera />
                </IconButton>
              </Box>
              {["firstName", "lastName", "email", "phone"].map(
                (field, index) => (
                  <TextField
                    key={field}
                    fullWidth
                    variant="filled"
                    label={t(field)}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values[field]}
                    name={field}
                    error={touched[field] && !!errors[field]}
                    helperText={touched[field] && errors[field]}
                    sx={{ gridColumn: "span 2" }}
                  />
                )
              )}
              <TextField
                fullWidth
                variant="filled"
                type="password"
                label={t("password")}
                onBlur={handleBlur}
                onChange={handleChange}
                name="password"
                error={touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                label={t("createdAt")}
                value={values.createdAt.split("T")[0]}
                name="createdAt"
                disabled
                sx={{ gridColumn: "span 2" }}
              />
              <FormControl
                fullWidth
                variant="filled"
                sx={{ gridColumn: "span 2" }}
              >
                <InputLabel>{t("role")}</InputLabel>
                <Select
                  name="role"
                  value={values.role}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={userInfo?.role !== "Admin"}
                >
                  {["Admin", "Coach", "Athlete", "Family"].map((role) => (
                    <MenuItem key={role} value={role}>
                      {t(role)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box display="flex" justifyContent="end" mt={2}>
              <Button
                //type="submit"
                variant="contained"
                color="secondary"
                onClick={() => handleFormSubmit(values)}
                sx={{
                  fontSize: "16px",
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
