import React, { useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Paper,
  Container,
  Alert,
  Typography,
  Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import { cardio } from "ldrs";
import { useTranslation } from "react-i18next";
import Title from "../../components/Title";
import { updateScheduleStatus } from "../../redux/scheduleSlice";
import { fetchTrainings } from "../../redux/trainingSlice";

const Training = () => {
  const { categoryId, trainingId } = useParams();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;
  const colors = tokens(theme.palette.mode);
  const { trainings, status, error } = useSelector((state) => state.training);
  const selectedTraining = trainings.find(
    (training) => training._id === trainingId
  );
  const userRole = useSelector((state) => state.user.userRole);

  const canChangeStatus = () => {
    return ["Family", "Athlete"].includes(userRole);
  };

  const getImageUrl = (imagePath) => {
    return `${API_URL}/${imagePath}`;
  };

  const handleStatusChange = (newStatus) => {
    dispatch(updateScheduleStatus({ id: trainingId, status: newStatus }));
  };

  useEffect(() => {
    if (categoryId) {
      dispatch(fetchTrainings({ categoryId }));
    }
  }, [dispatch, categoryId]);

  cardio.register();
  if (status === "loading") {
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
  if (status === "failed") {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Container>
      <Title title={selectedTraining?.name} subtitle={t("trainingDetails")} />
      <Box display="flex" justifyContent="start" margin="20px">
        <Button
          onClick={() => navigate(-1)}
          color="secondary"
          variant="contained"
        >
          {t("backToTrainings")}
        </Button>
      </Box>
      <Paper
        sx={{
          width: "100%",
          maxWidth: "800px",
          height: "400px",
          margin: "2rem auto",
          backgroundColor: "rgba(0, 0, 0, 0.1)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "1rem",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {selectedTraining?.image ? (
          <img
            src={getImageUrl(selectedTraining?.image)}
            alt={selectedTraining.name}
            crossOrigin="anonymous"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />
        ) : (
          <Typography variant="h3" color="textSecondary">
            {t("mediaPlaceholder")}
          </Typography>
        )}
      </Paper>
      <Box
        sx={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "2rem",
          backgroundColor: colors.primary[400],
          borderRadius: "8px",
        }}
      >
        <Typography variant="h4" sx={{ mb: 3 }}>
          {t("description")}:
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          {selectedTraining?.description}
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "2rem",
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ mb: 1 }}>
              {t("numberOfSets")}:
            </Typography>
            <Typography variant="body1">
              {selectedTraining?.numberOfSets}
            </Typography>
          </Box>
          <Box>
            <Typography variant="h5" sx={{ mb: 1 }}>
              {t("numberOfRepeats")}:
            </Typography>
            <Typography variant="body1">
              {selectedTraining?.numberOfRepeats}
            </Typography>
          </Box>
          <Box>
            <Typography variant="h5" sx={{ mb: 1 }}>
              {t("restBetweenSets")}:
            </Typography>
            <Typography variant="body1">
              {selectedTraining?.restBetweenSets} {t("minute")}
            </Typography>
          </Box>
          <Box>
            <Typography variant="h5" sx={{ mb: 1 }}>
              {t("restBetweenRepeats")}:
            </Typography>
            <Typography variant="body1">
              {selectedTraining?.restBetweenRepeats} {t("minute")}
            </Typography>
          </Box>
        </Box>

        <Box
          mt={4}
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          gap="1rem"
        >
          <Box width={{ xs: "100%", sm: "200px" }}>
            {selectedTraining?.file && (
              <Button
                variant="contained"
                color="secondary"
                href={`${API_URL}/${selectedTraining.file}`}
                target="_blank"
                rel="noopener noreferrer"
                fullWidth
                sx={{ height: "40px" }}
              >
                {t("viewTrainingFile")}
              </Button>
            )}
          </Box>
          {canChangeStatus() && (
            <Box
              width={{ xs: "100%", sm: "auto" }}
              display="flex"
              flexDirection={{ xs: "column", sm: "row" }}
              gap="1rem"
            >
              <Button
                onClick={() => handleStatusChange("Completed")}
                color="success"
                variant="contained"
                fullWidth
                sx={{ width: { sm: "200px" }, height: "40px" }}
              >
                {t("markAsCompleted")}
              </Button>
              <Button
                onClick={() => handleStatusChange("Cancelled")}
                color="error"
                variant="contained"
                fullWidth
                sx={{ width: { sm: "200px" }, height: "40px" }}
              >
                {t("markAsCancelled")}
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default Training;
