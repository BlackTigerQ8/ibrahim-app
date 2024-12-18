import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, Paper, Container, Alert, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../theme";
import { cardio } from "ldrs";
import { useTranslation } from "react-i18next";
import Title from "../components/Title";

const Training = () => {
  const { trainingId } = useParams();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // Assuming you'll create these in your trainingSlice
  const { trainings, status, error } = useSelector((state) => state.training);
  const selectedTraining = trainings.find(
    (training) => training._id === trainingId
  );

  useEffect(() => {
    // TODO: Add fetchTrainingById action in trainingSlice
    // dispatch(fetchTrainingById(trainingId));
  }, [dispatch, trainingId]);

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
        }}
      >
        <Typography variant="h3" color="textSecondary">
          {t("mediaPlaceholder")}
        </Typography>
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
              {selectedTraining?.restBetweenSets} {t("seconds")}
            </Typography>
          </Box>
          <Box>
            <Typography variant="h5" sx={{ mb: 1 }}>
              {t("restBetweenRepeats")}:
            </Typography>
            <Typography variant="body1">
              {selectedTraining?.restBetweenRepeats} {t("seconds")}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Training;
