import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Alert,
  Button,
  Backdrop,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import { cardio } from "ldrs";
import { useTranslation } from "react-i18next";
import {
  fetchSchedules,
  updateScheduleStatus,
} from "../../redux/scheduleSlice";
import Title from "../../components/Title";
import { useNavigate } from "react-router-dom";

const UserSchedule = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { schedules, status, error } = useSelector((state) => state.schedule);
  const { userInfo } = useSelector((state) => state.user);

  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    dispatch(fetchSchedules());
  }, [dispatch]);

  // Filter schedules for the current user
  const userSchedules = schedules.filter(
    (schedule) => schedule.athlete._id === userInfo?._id
  );

  const handleStatusUpdate = async (scheduleId, newStatus) => {
    try {
      setIsUpdating(true);
      await dispatch(
        updateScheduleStatus({ id: scheduleId, status: newStatus })
      ).unwrap();
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleViewTraining = (schedule) => {
    navigate(
      `/categories/${schedule?.category?._id}/trainings/${schedule?.training?._id}`,
      {
        state: { scheduleId: schedule._id, isFromSchedule: true },
      }
    );
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
                key={schedule?._id}
                sx={{
                  // backgroundColor: getStatusColor(schedule?.status),
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
                        {schedule?.training?.name}
                      </Typography>
                      <Typography
                        variant="body1"
                        color={colors.neutral.light}
                        sx={{ mt: 1 }}
                      >
                        {new Date(schedule?.date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
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
                          backgroundColor: getStatusColor(schedule?.status),
                          color: colors.primary.main,
                          padding: "0.5rem 1rem",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          handleStatusUpdate(
                            schedule._id,
                            schedule.status === "Pending"
                              ? "Completed"
                              : "Pending"
                          )
                        }
                      >
                        {t(schedule?.status)}
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
