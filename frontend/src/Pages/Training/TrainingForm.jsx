import React, { useEffect, useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import { cardio } from "ldrs";
import { useDispatch, useSelector } from "react-redux";
import {
  Alert,
  Backdrop,
  Box,
  Button,
  Container,
  FormControl,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { ErrorMessage, Formik, useFormik } from "formik";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import Title from "../../components/Title";
import { fetchCategories } from "../../redux/categorySlice";
import { createTraining } from "../../redux/trainingSlice";
import { useNavigate, useParams } from "react-router-dom";

const TrainingForm = () => {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const savedToken = localStorage.getItem("token");
  const user = Boolean(savedToken);
  const { userInfo, userRole } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { categories, status, error } = useSelector((state) => state.category);
  const { status: trainingStatus, error: trainingError } = useSelector(
    (state) => state.training
  );
  const isLoading = trainingStatus === "loading";
  const userCategories =
    userRole === "Admin"
      ? categories
      : categories.filter((category) => category.createdBy === userInfo._id);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCategories());
    }
  }, [dispatch, status]);

  const initialValues = {
    name: "",
    description: "",
    numberOfRepeats: "",
    numberOfSets: "",
    restBetweenSets: "",
    restBetweenRepeats: "",
    category: categoryId || "",
    file: "",
    image: "",
    createdAt: new Date(),
  };

  const validationSchema = yup.object().shape({
    name: yup.string().required(t("nameIsRequired")),
    description: yup.string().required(t("descriptionIsRequired")),
    numberOfRepeats: yup.number().required(t("numberOfRepeatsIsRequired")),
    numberOfSets: yup.number().required(t("numberOfSetsIsRequired")),
    restBetweenSets: yup.number().required(t("restBetweenSetsIsRequired")),
    restBetweenRepeats: yup
      .number()
      .required(t("restBetweenRepeatsIsRequired")),
    category: yup
      .string()
      .required(t("categoryIsRequired"))
      .oneOf(
        categories.map((category) => category._id),
        t("invalidCategory")
      ),
    file: yup.mixed().test("fileType", t("onlyPdfAllowed"), (value) => {
      if (!value) return true;
      const allowedTypes = ["application/pdf"];
      return allowedTypes.includes(value.type);
    }),
    image: yup.mixed().test("fileType", t("onlyImageAllowed"), (value) => {
      if (!value) return true;
      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "video/mp4",
        "video/quicktime", // For .mov files
        "video/x-msvideo", // For .avi files
      ];
      return allowedTypes.includes(value.type);
    }),
  });

  const handleFormSubmit = async (values) => {
    try {
      const formData = new FormData();
      // Add all training data to FormData
      Object.keys(values).forEach((key) => {
        if (key === "file" || key === "image") {
          if (values[key]) {
            formData.append(key, values[key]);
          }
        } else if (key === "category") {
          formData.append("category", values.category.toString());
        } else {
          formData.append(key, values[key]);
        }
      });

      const result = await dispatch(createTraining({ formData })).unwrap();

      if (result) {
        navigate(`/categories/${values.category}/trainings`);
      }
    } catch (error) {
      console.error("Training creation failed:", error);
    }
  };

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

  if (status === "loading") {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        bgcolor={theme.palette.background.default}
      >
        <div>
          <l-cardio size="70" speed="1.75" color={colors.secondary.main} />
        </div>
      </Box>
    );
  }

  if (status === "failed") {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <>
      <Container>
        <Backdrop
          sx={{
            color: colors.secondary.main,
            zIndex: (theme) => theme.zIndex.modal + 1,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
          }}
          open={isLoading}
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={2}
          >
            <l-cardio
              size="50"
              stroke="4"
              speed="1.75"
              color={colors.secondary.main}
            />
            <Typography variant="h6" color="secondary">
              {t("creatingTraining")}
            </Typography>
          </Box>
        </Backdrop>
        <Box>
          <Title
            title={t("trainingFormTitle")}
            subtitle={t("trainingFormSubtitle")}
          />
        </Box>
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
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label={t("name")}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.name}
                  name="name"
                  error={!!touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
                  sx={{ gridColumn: "span 4", ...commonInputStyles }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  multiline
                  rows={4}
                  label={t("description")}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.description}
                  name="description"
                  error={!!touched.description && !!errors.description}
                  helperText={touched.description && errors.description}
                  sx={{ gridColumn: "span 4", ...commonInputStyles }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="number"
                  label={t("numberOfRepeats")}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.numberOfRepeats}
                  name="numberOfRepeats"
                  error={!!touched.numberOfRepeats && !!errors.numberOfRepeats}
                  helperText={touched.numberOfRepeats && errors.numberOfRepeats}
                  sx={{ gridColumn: "span 2", ...commonInputStyles }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="number"
                  label={t("numberOfSets")}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.numberOfSets}
                  name="numberOfSets"
                  error={!!touched.numberOfSets && !!errors.numberOfSets}
                  helperText={touched.numberOfSets && errors.numberOfSets}
                  sx={{ gridColumn: "span 2", ...commonInputStyles }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="number"
                  label={t("restBetweenSets")}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.restBetweenSets}
                  name="restBetweenSets"
                  error={!!touched.restBetweenSets && !!errors.restBetweenSets}
                  helperText={touched.restBetweenSets && errors.restBetweenSets}
                  sx={{ gridColumn: "span 2", ...commonInputStyles }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="number"
                  label={t("restBetweenRepeats")}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.restBetweenRepeats}
                  name="restBetweenRepeats"
                  error={
                    !!touched.restBetweenRepeats && !!errors.restBetweenRepeats
                  }
                  helperText={
                    touched.restBetweenRepeats && errors.restBetweenRepeats
                  }
                  sx={{ gridColumn: "span 2", ...commonInputStyles }}
                />
                <FormControl
                  fullWidth
                  sx={{
                    gridColumn: "span 2",
                    position: "relative",
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "secondary.main",
                    },
                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                      {
                        borderColor: "secondary.main",
                      },
                  }}
                >
                  <InputLabel id="select-user-label">
                    {t("selectCategory")}
                  </InputLabel>
                  <Select
                    labelId="select-user-label"
                    id="select-category"
                    value={values.category || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!touched.category && !!errors.category}
                    name="category"
                    label={t("selectCategory")}
                  >
                    {Array.isArray(userCategories) &&
                      userCategories.map((category) => (
                        <MenuItem key={category._id} value={category._id}>
                          {category.name}
                        </MenuItem>
                      ))}
                  </Select>

                  {values.category && (
                    <IconButton
                      onClick={() => setFieldValue("category", "")}
                      style={{
                        position: "absolute",
                        top: "50%",
                        right: "8px",
                        transform: "translateY(-50%)",
                      }}
                    >
                      <ClearIcon />
                    </IconButton>
                  )}
                </FormControl>

                <FormControl
                  fullWidth
                  sx={{ gridColumn: "span 2", ...commonInputStyles }}
                >
                  <InputLabel shrink htmlFor="file">
                    {t("uploadFile")}
                  </InputLabel>
                  <Input
                    id="file"
                    type="file"
                    name="file"
                    onBlur={handleBlur}
                    onChange={(event) => {
                      setFieldValue("file", event.currentTarget.files[0]);
                    }}
                    error={!!touched.file && !!errors.file}
                    // helperText={touched.file && errors.file}
                  />
                  <ErrorMessage
                    name="file"
                    render={(msg) => (
                      <Typography variant="caption" color="error">
                        {msg}
                      </Typography>
                    )}
                  />
                </FormControl>
                <FormControl
                  fullWidth
                  sx={{ gridColumn: "span 2", ...commonInputStyles }}
                >
                  <InputLabel shrink htmlFor="image">
                    {t("uploadImageOrVideo")}
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
                    inputProps={{
                      accept: "image/*,video/*",
                    }}
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
              <Box display="flex" justifyContent="end" mt={2}>
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  disabled={isLoading}
                  onClick={() => handleFormSubmit(values)}
                  sx={{
                    marginTop: "1rem",
                    fontSize: "12px",
                    minWidth: isNonMobile ? "120px" : "100%",
                  }}
                >
                  {isLoading ? (
                    <l-cardio
                      size="20"
                      speed="1.75"
                      color={colors.secondary.main}
                    />
                  ) : (
                    t("update")
                  )}
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Container>
    </>
  );
};

export default TrainingForm;
