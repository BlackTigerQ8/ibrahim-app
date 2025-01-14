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
} from "@mui/material";
import { ErrorMessage, Formik } from "formik";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import Title from "../../components/Title";
import { createCategory } from "../../redux/categorySlice";
import * as Yup from "yup";
import { useParams, useNavigate } from "react-router-dom";

const CategoryForm = () => {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isLoading, setIsLoading] = useState(true);
  const savedToken = localStorage.getItem("token");
  const user = Boolean(savedToken);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.user);
  const { categories, status, error } = useSelector((state) => state.category);
  const API_URL = process.env.REACT_APP_API_URL;
  const { id } = useParams();
  const categoryInfo = categories.find((category) => category._id === id);
  const [categoryImage, setCategoryImage] = useState(categoryInfo?.image || "");

  const initialValues = {
    name: "",
    description: "",
    image: "",
  };

  const userSchema = yup.object().shape({
    name: yup.string().required(t("nameIsRequired")),
    description: yup.string().required(t("descriptionIsRequired")),
    image: yup.mixed().test("fileType", t("onlyImageAllowed"), (value) => {
      if (!value) return true;
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
      return allowedTypes.includes(value.type);
    }),
  });

  const validationSchema = Yup.object({
    image: Yup.mixed().test(
      "fileType",
      t("onlyImagesAllowed"),
      (value) =>
        !value || ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
    ),
  });

  const handleFormSubmit = async (values) => {
    console.log("Form Values before submit:", values);
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);

    if (values.image) {
      formData.append("image", values.image);
    }

    // Log FormData content for debugging
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    await dispatch(createCategory(formData));
    navigate("/categories");
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
      <Box>
        <Title
          title={t("categoriesFormTitle")}
          subtitle={t("categoriesFormSubtitle")}
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

              <FormControl
                fullWidth
                sx={{ gridColumn: "span 4", ...commonInputStyles }}
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
                {t("createNewCategory")}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Container>
  );
};

export default CategoryForm;
