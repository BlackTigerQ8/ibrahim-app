import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Paper,
  Container,
  Alert,
  Typography,
  Button,
  Backdrop,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import { cardio } from "ldrs";
import { useTranslation } from "react-i18next";
import Title from "../../components/Title";
import { updateScheduleStatus } from "../../redux/scheduleSlice";
import { fetchTrainings } from "../../redux/trainingSlice";
import { PictureAsPdf } from "@mui/icons-material";

const Training = () => {
  const { categoryId, trainingId } = useParams();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const scheduleId = location.state?.scheduleId;
  const isFromSchedule = location.state?.isFromSchedule;
  const API_URL = process.env.REACT_APP_API_URL;
  const colors = tokens(theme.palette.mode);
  const { trainings, status, error } = useSelector((state) => state.training);
  const selectedTraining = trainings.find(
    (training) => training._id === trainingId
  );
  const userRole = useSelector((state) => state.user.userRole);
  const scheduleStatus = useSelector(
    (state) =>
      state.schedule.schedules.find((s) => s._id === scheduleId)?.status
  );

  const [isUpdating, setIsUpdating] = useState(false);

  const canChangeStatus = () => {
    // For Family role, only show buttons if they came from UserSchedule page
    if (userRole === "Family") {
      return (
        scheduleId &&
        scheduleStatus &&
        !["Completed", "Cancelled"].includes(scheduleStatus) &&
        isFromSchedule === true
      ); // Explicitly check for true
    }
    return (
      userRole === "Athlete" &&
      !["Completed", "Cancelled"].includes(scheduleStatus)
    );
  };

  const handleStatusChange = async (newStatus) => {
    if (!scheduleId) {
      console.error("No scheduleId available");
      return;
    }

    try {
      setIsUpdating(true);
      await dispatch(
        updateScheduleStatus({
          id: scheduleId,
          status: newStatus,
        })
      ).unwrap();
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getImageUrl = (imagePath) => {
    return `${API_URL}/${imagePath}`;
  };

  const renderMedia = () => {
    if (!selectedTraining?.image) {
      return (
        <Typography variant="h3" color="textSecondary">
          {t("mediaPlaceholder")}
        </Typography>
      );
    }

    const mediaUrl = getImageUrl(selectedTraining.image);
    const isVideo = selectedTraining.image
      ?.toLowerCase()
      .match(/\.(mp4|mov|avi|_compressed\.mp4)$/i);

    if (!mediaUrl) return null;

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
          height: "100%",
          objectFit: "cover",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />
    ) : (
      <img
        src={mediaUrl}
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
    );
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
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100dvh",
        }}
      >
        <Alert severity="error">{error}</Alert>
      </Box>
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
        open={isUpdating}
      >
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <l-cardio
            size="50"
            stroke="4"
            speed="1.75"
            color={colors.secondary.main}
          />
          <Typography variant="h6" color="secondary">
            {t("updatingStatus")}
          </Typography>
        </Box>
      </Backdrop>
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
        {renderMedia()}
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
                startIcon={<PictureAsPdf />}
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
