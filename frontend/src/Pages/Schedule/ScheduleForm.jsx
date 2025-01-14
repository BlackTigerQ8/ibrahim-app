import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSchedule } from "../../redux/scheduleSlice";
import { fetchCategories } from "../../redux/categorySlice";
import { fetchTrainings } from "../../redux/trainingSlice";
import { Form, Input, DatePicker, message } from "antd";
import { useTranslation } from "react-i18next";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import {
  Box,
  Button,
  Container,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import Title from "../../components/Title";

const ScheduleForm = () => {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = useSelector((state) => state.category.categories);
  const trainings = useSelector((state) => state.training.trainings);
  const athletes = useSelector((state) =>
    state.users.users.filter(
      (user) => user.role === "Athlete" || user.role === "Family"
    )
  );
  const [formValues, setFormValues] = useState({
    athlete: "",
    category: "",
    training: "",
    date: null,
    notes: "",
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (selectedCategory) {
      dispatch(fetchTrainings({ categoryId: selectedCategory }));
    }
  }, [selectedCategory, dispatch]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await dispatch(
        createSchedule({
          ...formValues,
          date: formValues.date
            ? new Date(formValues.date).toISOString()
            : null,
        })
      ).unwrap();
      setFormValues({
        athlete: "",
        category: "",
        training: "",
        date: null,
        notes: "",
      });
      message.success(t("scheduleCreatedSuccessfully"));
    } catch (error) {
      message.error(t("errorCreatingSchedule"));
    }
  };

  const handleSelectChange = (field, value) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (field === "category") {
      setSelectedCategory(value);
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

  return (
    <Container>
      <Box>
        <Title
          title={t("scheduleFormTitle")}
          subtitle={t("scheduleFormSubtitle")}
        />
      </Box>
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
          >
            <InputLabel id="athlete-label">{t("athlete")}</InputLabel>
            <Select
              labelId="athlete-label"
              value={formValues.athlete}
              onChange={(e) => handleSelectChange("athlete", e.target.value)}
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
          >
            <InputLabel id="category-label">{t("category")}</InputLabel>
            <Select
              labelId="category-label"
              value={formValues.category}
              onChange={(e) => handleSelectChange("category", e.target.value)}
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
          >
            <InputLabel id="training-label">{t("training")}</InputLabel>
            <Select
              labelId="training-label"
              value={formValues.training}
              onChange={(e) => handleSelectChange("training", e.target.value)}
              disabled={!selectedCategory}
              label={t("training")}
            >
              {trainings.map((training) => (
                <MenuItem key={training._id} value={training._id}>
                  {training.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Date picker will need custom styling to match MUI */}

          <TextField
            fullWidth
            variant="filled"
            type="date"
            label={t("date")}
            value={formValues.date || ""}
            onChange={(e) => handleSelectChange("date", e.target.value)}
            sx={{ gridColumn: "span 2", ...commonInputStyles }}
          />

          <TextField
            fullWidth
            variant="filled"
            multiline
            rows={4}
            label={t("notes")}
            name="notes"
            value={formValues.notes}
            onChange={(e) => handleSelectChange("notes", e.target.value)}
            sx={{ gridColumn: "span 4", ...commonInputStyles }}
          />
        </Box>

        <Box display="flex" justifyContent="end" mt="20px">
          <Button type="submit" color="secondary" variant="contained">
            {t("createSchedule")}
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default ScheduleForm;
