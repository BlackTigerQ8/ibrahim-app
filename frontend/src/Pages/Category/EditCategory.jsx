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
import { useSelector, useDispatch } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { tokens } from "../../theme";
import Title from "../../components/Title";
import { fetchCategories, updateCategory } from "../../redux/categorySlice";
import { PhotoCamera } from "@mui/icons-material";
import Avatar from "../../assets/avatar.jpg";

const EditCategory = () => {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const API_URL = process.env.REACT_APP_API_URL;
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { categoryId } = useParams();
  const { categories, status, error } = useSelector((state) => state.category);
  const categoryInfo = categories.find(
    (category) => category._id === categoryId
  );

  const token =
    useSelector((state) => state.user.token) || localStorage.getItem("token");
  const [categoryImage, setCategoryImage] = useState(categoryInfo?.image || "");

  const initialValues = categoryInfo || {
    name: "",
    description: "",
    image: "",
    createdAt: "",
  };

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCategories());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (categoryInfo?.image)
      setCategoryImage(`${API_URL}/${categoryInfo.image}`);
  }, [categoryInfo, API_URL]);

  const validationSchema = Yup.object({
    name: Yup.string().required(t("required")),
    description: Yup.string().required(t("required")),
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
      setCategoryImage(file);
    } else {
      console.error(t("invalidImageType"));
    }
  };

  const handleFormSubmit = async (values) => {
    if (!categoryId) {
      console.error("No category ID found.");
      return;
    }

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (key !== "_id" && key !== "__v") {
        formData.append(key, value);
      }
    });

    if (categoryImage instanceof File) {
      formData.append("image", categoryImage);
    }

    try {
      // Fix: Pass categoryId correctly in the object
      await dispatch(
        updateCategory({
          id: categoryId, // Changed from categoryId to {id: categoryId}
          updatedData: formData,
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
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <l-pulsar
          size="70"
          speed="1.75"
          color={colors.secondary.main}
        ></l-pulsar>
      </Box>
    );
  }

  if (categoryInfo === undefined) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <p>undefined</p>
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
        title={t("editCategoryTitle")}
        subtitle={t("editCategorySubtitle")}
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
                  crossOrigin="anonymous"
                  src={
                    categoryImage
                      ? categoryImage instanceof File
                        ? URL.createObjectURL(categoryImage)
                        : categoryImage
                      : Avatar
                  }
                  alt={t("profileImage")}
                  style={{
                    width: "100%",
                    height: "auto",
                    maxHeight: 300,
                    marginBottom: "16px",
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
              {["name", "description"].map((field, index) => (
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
              ))}
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
                type="submit"
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

export default EditCategory;
