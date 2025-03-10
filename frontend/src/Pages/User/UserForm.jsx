import React, { useEffect, useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import { cardio } from "ldrs";
import { setUser } from "../../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Container,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Backdrop,
} from "@mui/material";
import { ErrorMessage, Formik } from "formik";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import Title from "../../components/Title";
import { registerUser } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { fetchCoaches, fetchUsers } from "../../redux/usersSlice";

const initialValues = {
  firstName: "",
  lastName: "",
  email: undefined,
  phone: "",
  dateOfBirth: "",
  role: "",
  image: "",
  password: "",
  confirmPassword: "",
};

const phoneRegExp = /^(?=([0-9\-\+])*?[0-9]{8,9}$)[\d\-\+]+$/;

const UserForm = () => {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isLoading, setIsLoading] = useState(true);
  const savedToken = localStorage.getItem("token");
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { userInfo } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { users } = useSelector((state) => state.users); // Add this line
  const [coaches, setCoaches] = useState([]);
  const [isCreating, setIsCreating] = useState(false);

  const userSchema = yup.object().shape({
    firstName: yup.string().required(t("firstNameIsRequired")),
    lastName: yup.string().required(t("lastNameIsRequired")),
    email: yup.string().email(t("invalidEmail")).required(t("emailIsRequired")),
    phone: yup
      .string()
      .matches(phoneRegExp, t("invalidPhoneNumber"))
      .test("digit-count", t("phoneNumberLength"), (value) => {
        if (!value) return false;
        const digitCount = value.replace(/\D/g, "").length; // Count only digits
        return digitCount >= 8 && digitCount <= 9;
      })
      .required(t("phoneIsRequired")),
    dateOfBirth: yup.string().required(t("dateOfBirthIsRequired")),
    role: yup.string().required(t("roleIsRequired")),
    image: yup.mixed().test("fileType", t("onlyImageAllowed"), (value) => {
      if (!value) return true;
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
      return allowedTypes.includes(value.type);
    }),
    password: yup
      .string()
      .min(6, t("passwordMinLength"))
      .required(t("passwordIsRequired")),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], t("passwordMustMatch"))
      .required(t("confirmPasswordIsRequired")),
    coach: yup.string().when("role", {
      is: (role) => role === "Athlete",
      then: () => yup.string().required(t("coachIsRequired")),
      otherwise: () => yup.string(),
    }),
  });

  const handleFormSubmit = async (values) => {
    setIsCreating(true);
    try {
      // Create FormData object to handle file upload
      const formData = new FormData();

      // Add all user data to FormData
      Object.keys(values).forEach((key) => {
        if (key !== "image") {
          formData.append(key, values[key]);
        }
      });

      if (values.image) {
        formData.append("image", values.image);
      }

      const result = await dispatch(registerUser(formData)).unwrap();

      if (result) {
        navigate("/users");
      }
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      if (savedToken) {
        const savedUser = JSON.parse(localStorage.getItem("userInfo"));
        if (savedUser) {
          dispatch(setUser(savedUser));
        }
      }
      setIsLoading(false);
    };

    checkUser();
  }, [dispatch, savedToken]);

  useEffect(() => {
    // Update coaches when users are fetched
    if (users) {
      const coachUsers = users.filter((user) => user.role === "Coach");
      setCoaches(coachUsers);
    }
  }, [users]);

  useEffect(() => {
    dispatch(fetchUsers(savedToken));
  }, [dispatch, savedToken]);

  const commonInputStyles = {
    "& .MuiInputLabel-root.Mui-focused": {
      color: "secondary.main",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "secondary.main",
    },
    "& .MuiFilledInput-root.Mui-focused": {
      borderColor: "secondary.main",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "secondary.main",
    },
    "& .MuiFilledInput-underline:after": {
      borderBottomColor: "secondary.main",
    },
  };

  cardio.register();
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100dvh",
        }}
      >
        <l-cardio
          size="70"
          speed="1.75"
          color={colors.secondary.main}
        ></l-cardio>
      </div>
    );
  }

  return (
    <Container>
      <Backdrop
        sx={{
          color: colors.secondary.main,
          zIndex: (theme) => theme.zIndex.modal + 1,
          backgroundColor: "rgba(0, 0, 0, 0.4)",
        }}
        open={isCreating}
      >
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <l-cardio
            size="50"
            stroke="4"
            speed="1.75"
            color={colors.secondary.main}
          />
          <Typography variant="h6" color="secondary">
            {t("creatingUser")}
          </Typography>
        </Box>
      </Backdrop>
      <Box>
        <Title title={t("userFormTitle")} subtitle={t("userFormSubtitle")} />
      </Box>
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={userSchema}
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
                sx={{ gridColumn: "span 2", ...commonInputStyles }}
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
                sx={{ gridColumn: "span 2", ...commonInputStyles }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label={t("email")}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email ?? undefined}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 2", ...commonInputStyles }}
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
                sx={{ gridColumn: "span 2", ...commonInputStyles }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="date"
                label={t("dateOfBirth")}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.dateOfBirth}
                name="dateOfBirth"
                error={!!touched.dateOfBirth && !!errors.dateOfBirth}
                helperText={touched.dateOfBirth && errors.dateOfBirth}
                sx={{ gridColumn: "span 2", ...commonInputStyles }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="password"
                label={t("password")}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={!!touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 2", ...commonInputStyles }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="password"
                label={t("confirmPassword")}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.confirmPassword}
                name="confirmPassword"
                error={!!touched.confirmPassword && !!errors.confirmPassword}
                helperText={touched.confirmPassword && errors.confirmPassword}
                sx={{ gridColumn: "span 2", ...commonInputStyles }}
              />
              <FormControl
                fullWidth
                variant="filled"
                sx={{ gridColumn: "span 2", ...commonInputStyles }}
              >
                <InputLabel htmlFor="role">{t("role")}</InputLabel>
                <Select
                  label="Role"
                  value={values.role}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="role"
                  error={!!touched.role && !!errors.role}
                  helperText={touched.role && errors.role}
                >
                  <MenuItem value={"Coach"}>{t("Coach")}</MenuItem>
                  <MenuItem value={"Athlete"}>{t("Athlete")}</MenuItem>
                  <MenuItem value={"Family"}>{t("Family")}</MenuItem>
                  {userInfo.role === "Admin" && (
                    <MenuItem value={"Admin"}>{t("Admin")}</MenuItem>
                  )}
                </Select>
              </FormControl>
              {/* Add coach selection field that appears when role is Athlete */}
              {values.role === "Athlete" && (
                <FormControl
                  fullWidth
                  variant="filled"
                  sx={{ gridColumn: "span 2", ...commonInputStyles }}
                >
                  <InputLabel htmlFor="coach">{t("coach")}</InputLabel>
                  <Select
                    label="Coach"
                    value={values.coach}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="coach"
                    error={!!touched.coach && !!errors.coach}
                  >
                    {coaches.map((coach) => (
                      <MenuItem key={coach._id} value={coach._id}>
                        {`${coach.firstName} ${coach.lastName}`}
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.coach && errors.coach && (
                    <Typography variant="caption" color="error">
                      {errors.coach}
                    </Typography>
                  )}
                </FormControl>
              )}
              <FormControl
                fullWidth
                sx={{ gridColumn: "span 2", ...commonInputStyles }}
              >
                <InputLabel shrink htmlFor="image">
                  {t("uploadImage")}
                </InputLabel>
                <Input
                  id="image"
                  type="file"
                  name="image"
                  onBlur={handleBlur}
                  onChange={(event) => {
                    setFieldValue("image", event.currentTarget.files[0]);
                  }}
                  error={!!touched.image && !!errors.image}
                  helperText={touched.image && errors.image}
                />
                <ErrorMessage
                  name="image"
                  render={(msg) => (
                    <Typography variant="caption" color="error">
                      {msg}
                    </Typography>
                  )}
                />
              </FormControl>
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                {t("createNewUser")}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Container>
  );
};

export default UserForm;
