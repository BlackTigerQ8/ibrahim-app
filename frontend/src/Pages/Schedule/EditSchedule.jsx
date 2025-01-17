import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Box,
  Button,
  TextField,
  useTheme,
  useMediaQuery,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";
import { tokens } from "../../theme";
import Title from "../../components/Title";
import { fetchCategories } from "../../redux/categorySlice";
import { fetchTrainings } from "../../redux/trainingSlice";
import { updateSchedule } from "../../redux/scheduleSlice";

const EditSchedule = () => {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { scheduleId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { schedules, status, error } = useSelector((state) => state.schedule);
  const scheduleInfo = schedules.find((e) => e._id === scheduleId);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const categories = useSelector((state) => state.category.categories);
  const trainings = useSelector((state) => state.training.trainings);
  const users = useSelector((state) => state.users.users);
  const athletes = useMemo(
    () =>
      users.filter((user) => user.role === "Athlete" || user.role === "Family"),
    [users]
  );

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (selectedCategory) {
      dispatch(fetchTrainings({ categoryId: selectedCategory }));
    }
  }, [selectedCategory, dispatch]);

  useEffect(() => {
    if (scheduleInfo?.category) {
      setSelectedCategory(scheduleInfo.category);
      // Fetch trainings for the selected category
      dispatch(fetchTrainings({ categoryId: scheduleInfo.category }));
    }
  }, [scheduleInfo, dispatch]);

  const handleFormSubmit = async (values) => {
    try {
      await dispatch(
        updateSchedule({
          id: scheduleId,
          scheduleData: {
            ...values,
            date: values.date ? new Date(values.date).toISOString() : null,
          },
        })
      ).unwrap();
      navigate("/schedules");
    } catch (error) {
      console.error("Failed to update schedule:", error);
    }
  };

  const validationSchema = Yup.object().shape({
    athlete: Yup.string().required(t("athleteRequired")),
    category: Yup.string().required(t("categoryRequired")),
    training: Yup.string().required(t("trainingRequired")),
    date: Yup.date().required(t("dateRequired")),
    notes: Yup.string(),
  });

  const [formValues, setFormValues] = useState({
    athlete: scheduleInfo?.athlete?._id || scheduleInfo?.athlete || "",
    category: scheduleInfo?.category?._id || scheduleInfo?.category || "",
    training: scheduleInfo?.training?._id || scheduleInfo?.training || "",
    date: scheduleInfo?.date ? scheduleInfo.date.split("T")[0] : "",
    notes: scheduleInfo?.notes || "",
  });

  if (!scheduleInfo) {
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
      >
        <l-pulsar
          size="70"
          speed="1.75"
          color={colors.secondary.main}
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
        <Alert>Error: {error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ margin: "0 1rem" }}>
      <Title
        title={t("editScheduleTitle")}
        subtitle={t("editScheduleSubtitle")}
      />
      <Formik
        initialValues={formValues}
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
              <FormControl
                fullWidth
                sx={{ gridColumn: "span 2", ...commonInputStyles }}
                error={!!touched.athlete && !!errors.athlete}
              >
                <InputLabel id="athlete-label">{t("athlete")}</InputLabel>
                <Select
                  labelId="athlete-label"
                  value={values.athlete}
                  onChange={(e) => setFieldValue("athlete", e.target.value)}
                  onBlur={handleBlur}
                  name="athlete"
                  label={t("athlete")}
                >
                  {athletes.map((athlete) => (
                    <MenuItem key={athlete._id} value={athlete._id}>
                      {`${athlete.firstName} ${athlete.lastName}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl
                fullWidth
                sx={{ gridColumn: "span 2", ...commonInputStyles }}
                error={!!touched.category && !!errors.category}
              >
                <InputLabel id="category-label">{t("category")}</InputLabel>
                <Select
                  labelId="category-label"
                  value={values.category}
                  onChange={(e) => {
                    setFieldValue("category", e.target.value);
                    setSelectedCategory(e.target.value);
                    setFieldValue("training", "");
                  }}
                  onBlur={handleBlur}
                  name="category"
                  label={t("category")}
                >
                  {categories.map((category) => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl
                fullWidth
                sx={{ gridColumn: "span 2", ...commonInputStyles }}
                error={!!touched.training && !!errors.training}
              >
                <InputLabel id="training-label">{t("training")}</InputLabel>
                <Select
                  labelId="training-label"
                  value={values.training || ""}
                  onChange={(e) => setFieldValue("training", e.target.value)}
                  onBlur={handleBlur}
                  name="training"
                  label={t("training")}
                  disabled={!selectedCategory}
                >
                  {trainings.map((training) => (
                    <MenuItem key={training._id} value={training._id}>
                      {training.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                variant="filled"
                type="date"
                label={t("date")}
                value={values.date || ""}
                onChange={(e) => setFieldValue("date", e.target.value)}
                onBlur={handleBlur}
                name="date"
                error={!!touched.date && !!errors.date}
                helperText={touched.date && errors.date}
                sx={{ gridColumn: "span 2", ...commonInputStyles }}
              />

              <TextField
                fullWidth
                variant="filled"
                multiline
                rows={4}
                label={t("notes")}
                name="notes"
                value={values.notes}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.notes && !!errors.notes}
                helperText={touched.notes && errors.notes}
                sx={{ gridColumn: "span 4", ...commonInputStyles }}
              />
            </Box>

            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                {t("update")}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default EditSchedule;
