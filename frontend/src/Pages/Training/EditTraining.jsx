import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  useTheme,
  useMediaQuery,
  Alert,
  Backdrop,
  Typography,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { tokens } from "../../theme";
import Title from "../../components/Title";
import { fetchTrainings, updateTraining } from "../../redux/trainingSlice";
import { PhotoCamera, PictureAsPdf } from "@mui/icons-material";
import Avatar from "../../assets/avatar.jpg";

const EditTraining = () => {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const API_URL = process.env.REACT_APP_API_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { categoryId, trainingId } = useParams();
  const { trainings, status, error } = useSelector((state) => state.training);
  const isLoading = status === "loading";
  const trainingInfo = trainings.find(
    (training) => training._id === trainingId
  );

  const [trainingImage, setTrainingImage] = useState(trainingInfo?.image || "");
  const [trainingFile, setTrainingFile] = useState(trainingInfo?.file || "");
  const [filePreviewUrl, setFilePreviewUrl] = useState("");

  const initialValues = trainingInfo || {
    name: "",
    description: "",
    numberOfRepeats: "",
    numberOfSets: "",
    restBetweenSets: "",
    restBetweenRepeats: "",
    category: categoryId,
    image: "",
    file: "",
  };

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTrainings({ categoryId }));
    }
  }, [dispatch, status, categoryId]);

  useEffect(() => {
    if (trainingInfo?.image) {
      setTrainingImage(`${API_URL}/${trainingInfo.image}`);
    }
    if (trainingInfo?.file) {
      const fileUrl = trainingInfo.file.startsWith("http")
        ? trainingInfo.file
        : `${API_URL}/${trainingInfo.file}`;
      setTrainingFile(fileUrl);
      setFilePreviewUrl(fileUrl);
    }
  }, [trainingInfo, API_URL]);

  const validationSchema = Yup.object({
    name: Yup.string().required(t("required")),
    description: Yup.string().required(t("required")),
    numberOfRepeats: Yup.number()
      .required(t("required"))
      .min(1, t("minValue", { value: 1 })),
    numberOfSets: Yup.number()
      .required(t("required"))
      .min(1, t("minValue", { value: 1 })),
    restBetweenSets: Yup.number()
      .required(t("required"))
      .min(0, t("minValue", { value: 0 })),
    restBetweenRepeats: Yup.number()
      .required(t("required"))
      .min(0, t("minValue", { value: 0 })),
    image: Yup.mixed().test(
      "fileType",
      t("onlyImagesAllowed"),
      (value) =>
        !value ||
        [
          "image/jpeg",
          "image/png",
          "image/jpg",
          "video/mp4",
          "video/quicktime",
          "video/x-msvideo",
        ].includes(value.type)
    ),
    file: Yup.mixed(),
  });

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (
      file &&
      [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "video/mp4",
        "video/quicktime",
        "video/x-msvideo",
      ].includes(file.type)
    ) {
      setTrainingImage(file);
    } else {
      console.error(t("invalidImageType"));
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setTrainingFile(file);
      setFilePreviewUrl(URL.createObjectURL(file));
    }
  };

  const renderMedia = () => {
    if (!trainingImage) return null;

    // Check if it's a video by file extension or mime type
    const isVideo =
      typeof trainingImage === "string"
        ? trainingImage
            .toLowerCase()
            .match(/\.(mp4|mov|avi|_compressed\.mp4)$/i)
        : trainingImage instanceof File &&
          trainingImage.type.startsWith("video/");

    // Create the media URL
    const mediaUrl =
      trainingImage instanceof File
        ? URL.createObjectURL(trainingImage)
        : `${API_URL}/${trainingImage}`;

    return isVideo ? (
      <video
        src={mediaUrl}
        autoPlay
        loop
        muted
        playsInline
        controls
        crossOrigin="anonymous"
        style={{
          width: "100%",
          height: "auto",
          maxHeight: 300,
          marginBottom: "16px",
          border: `2px solid ${colors.secondary.main}`,
          objectFit: "cover",
        }}
      />
    ) : (
      <img
        crossOrigin="anonymous"
        src={mediaUrl || Avatar}
        alt={t("trainingImage")}
        style={{
          width: "100%",
          height: "auto",
          maxHeight: 300,
          marginBottom: "16px",
          border: `2px solid ${colors.secondary.main}`,
        }}
      />
    );
  };

  const handleFormSubmit = async (values) => {
    if (!trainingId) {
      console.error("No training ID found.");
      return;
    }

    const valuesToUpdate = { ...values, category: categoryId };

    const formData = new FormData();

    Object.entries(valuesToUpdate).forEach(([key, value]) => {
      if (key !== "_id" && key !== "__v" && key !== "image" && key !== "file") {
        formData.append(key, value);
      }
    });

    if (trainingImage instanceof File) {
      formData.append("image", trainingImage);
    }
    if (trainingFile instanceof File) {
      formData.append("file", trainingFile);
    }

    try {
      await dispatch(
        updateTraining({
          trainingId,
          trainingData: formData,
        })
      ).unwrap();
      navigate(`/categories/${categoryId}/trainings`);
    } catch (error) {
      console.error(error);
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

  if (trainingInfo === undefined) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Alert severity="error">undefined</Alert>
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
        <Alert>Error: {error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ margin: "0 1rem" }}>
      <Backdrop
        sx={{
          color: colors.secondary.main,
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "rgba(0, 0, 0, 0.4)",
        }}
        open={isLoading}
      >
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <l-cardio
            size="50"
            stroke="4"
            speed="1.75"
            color={colors.secondary.main}
          />
          <Typography variant="h6" color="secondary">
            {t("updatingTraining")}
          </Typography>
        </Box>
      </Backdrop>
      <Title
        title={t("editTrainingTitle")}
        subtitle={t("editTrainingSubtitle")}
      />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
        enableReinitialize
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
            <Backdrop
              sx={{
                color: colors.secondary.main,
                zIndex: (theme) => theme.zIndex.drawer + 1,
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
                  {t("updatingTraining")}
                </Typography>
              </Box>
            </Backdrop>
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
                {renderMedia()}
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<PhotoCamera />}
                  color="secondary"
                  sx={{
                    marginTop: "1rem",
                    fontSize: "12px",
                  }}
                >
                  {t("uploadImageOrVideo")}
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleImageUpload}
                    hidden
                  />
                </Button>
              </Box>

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
                label={t("description")}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.description}
                name="description"
                multiline
                rows={4}
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

              <Box
                gridColumn="span 4"
                display="flex"
                gap={2}
                alignItems="center"
                sx={{ flexDirection: isNonMobile ? "row" : "column" }}
              >
                {filePreviewUrl && (
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<PictureAsPdf />}
                    sx={{
                      //   marginTop: "1rem",
                      fontSize: "12px",
                      minWidth: isNonMobile ? "250px" : "100%",
                    }}
                    onClick={() => window.open(filePreviewUrl, "_blank")}
                  >
                    {t("viewFile")}
                  </Button>
                )}
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<PictureAsPdf />}
                  color="secondary"
                  sx={{
                    fontSize: "12px",
                    minWidth: isNonMobile ? "120px" : "100%",
                  }}
                >
                  {t("uploadFile")}
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileUpload}
                    hidden
                  />
                </Button>
              </Box>
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
    </Box>
  );
};

export default EditTraining;
