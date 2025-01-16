import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Alert,
  Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import { cardio } from "ldrs";
import { useTranslation } from "react-i18next";
import { fetchSchedules } from "../../redux/scheduleSlice";
import Title from "../../components/Title";
import { useNavigate, useParams } from "react-router-dom";

const UserSchedule = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const { trainingId } = useParams();

  const { schedules, status, error } = useSelector((state) => state.schedule);
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchSchedules());
  }, [dispatch]);

  // Filter schedules for the current user
  const userSchedules = schedules.filter(
    (schedule) => schedule.athlete._id === userInfo?._id
  );

  const handleViewTraining = (schedule) => {
    navigate(`/categories/${categoryId}/trainings/${trainingId}`);
  };

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

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return colors.status.success;
      case "Cancelled":
        return colors.status.error;
      default:
        return colors.status.default;
    }
  };

  return (
    <Container>
      <Box>
        <Title title={t("MY_SCHEDULE")} subtitle={t("yourTrainingSchedule")} />

        {userSchedules.length > 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              margin: "2rem 0",
            }}
          >
            {userSchedules.map((schedule) => (
              <Card
                key={schedule._id}
                sx={{
                  backgroundColor: getStatusColor(schedule.status),
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "1rem",
                    }}
                  >
                    <Box>
                      <Typography variant="h5" color={colors.neutral.white}>
                        {schedule.training?.name}
                      </Typography>
                      <Typography
                        variant="body1"
                        color={colors.neutral.light}
                        sx={{ mt: 1 }}
                      >
                        {new Date(schedule.date).toLocaleString()}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        gap: "1rem",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          backgroundColor: colors.primary.light,
                          padding: "0.5rem 1rem",
                          borderRadius: "4px",
                        }}
                      >
                        {t(schedule.status)}
                      </Typography>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleViewTraining(schedule)}
                      >
                        {t("viewTraining")}
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "50vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Alert severity="info">{t("noScheduledTrainings")}</Alert>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default UserSchedule;
