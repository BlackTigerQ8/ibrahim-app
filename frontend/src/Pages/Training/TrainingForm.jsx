import React, { useEffect, useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import { cardio } from "ldrs";
import { setUser } from "../../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  Alert,
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
import { ErrorMessage, Formik } from "formik";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import Title from "../../components/Title";
import { fetchCategories } from "../../redux/categorySlice";

const TrainingForm = () => {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isLoading, setIsLoading] = useState(true);
  const savedToken = localStorage.getItem("token");
  const user = Boolean(savedToken);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { userInfo } = useSelector((state) => state.user);
  const { categories, status, error } = useSelector((state) => state.category);

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
    category: "",
    image: "",
    createdAt: new Date(),
  };

  const userSchema = yup.object().shape({
    name: yup.string().required(t("nameIsRequired")),
    description: yup.string().required(t("descriptionIsRequired")),
    numberOfRepeats: yup.number().required(t("numberOfRepeatsIsRequired")),
    numberOfSets: yup.number().required(t("numberOfSetsIsRequired")),
    restBetweenSets: yup.number().required(t("restBetweenSetsIsRequired")),
    restBetweenRepeats: yup
      .number()
      .required(t("restBetweenRepeatsIsRequired")),
    category: yup.string().required(t("categoryIsRequired")),
    role: yup.string().required(t("roleIsRequired")),
    image: yup.mixed().test("fileType", t("onlyImageAllowed"), (value) => {
      if (!value) return true;
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
      return allowedTypes.includes(value.type);
    }),
  });

  const handleFormSubmit = async (values) => {
    console.log("Form Values before submit:", values);
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("role", values.role);

    if (values.image) {
      formData.append("image", values.image);
    }

    // Log FormData content for debugging
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    // await dispatch(createCategory(formData));
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
      {" "}
      <Container>
        <Box>
          <Title
            title={t("trainingFormTitle")}
            subtitle={t("trainingFormSubtitle")}
          />
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
                  label={t("name")}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.name}
                  name="name"
                  error={!!touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label={t("description")}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.description}
                  name="description"
                  error={!!touched.description && !!errors.description}
                  helperText={touched.description && errors.description}
                  sx={{ gridColumn: "span 2" }}
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
                  sx={{ gridColumn: "span 2" }}
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
                  sx={{ gridColumn: "span 2" }}
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
                  sx={{ gridColumn: "span 2" }}
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
                  sx={{ gridColumn: "span 2" }}
                />
                <FormControl
                  fullWidth
                  sx={{ gridColumn: "span 2", position: "relative" }}
                >
                  <InputLabel id="select-user-label">
                    {t("selectCategory")}
                  </InputLabel>
                  <Select
                    labelId="select-user-label"
                    id="select-category"
                    value={values.category || []}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!touched.category && !!errors.category}
                    name="category"
                    label="Select Category"
                  >
                    {Array.isArray(categories) &&
                      categories.map((category) => (
                        <MenuItem key={category._id} value={category._id}>
                          {category.name}
                        </MenuItem>
                      ))}
                  </Select>
                  {Array.isArray(values.categories) &&
                    values.categories.length > 0 && (
                      <IconButton
                        onClick={() => setFieldValue("categories")}
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

                <FormControl fullWidth sx={{ gridColumn: "span 2" }}>
                  <InputLabel shrink htmlFor="file">
                    {t("uploadFile")}
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
                  {t("createNewTraining")}
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
