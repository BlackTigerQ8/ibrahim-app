import React, { useEffect } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../theme";
import { cardio } from "ldrs";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, Container, Alert, CircularProgress } from "@mui/material";
import { useTranslation } from "react-i18next";
import Title from "../components/Title";
import { useNavigate } from "react-router-dom";
import { fetchTrainings } from "../redux/trainingSlice";

const Trainings = () => {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const token =
    useSelector((state) => state.user.token) || localStorage.getItem("token");

  const {
    trainings = [],
    status,
    error,
  } = useSelector((state) => state.training); // Default to empty array if trainings is undefined

  useEffect(() => {
    dispatch(fetchTrainings(token));
  }, [dispatch, token]);

  cardio.register();

  // Handle different loading states
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
      <Box>
        <Title title={t("TRAININGS")} subtitle={t("availableTrainings")} />
        <Box display="flex" justifyContent="start" margin="20px">
          <Button
            onClick={() => navigate("/training-form")}
            color="secondary"
            variant="contained"
          >
            {t("createNewTraining")}
          </Button>
        </Box>

        {/* Display list of trainings */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: "2rem",
            justifyContent: isNonMobile ? "flex-start" : "center",
            margin: "2rem 0",
          }}
        >
          {trainings.length > 0 ? (
            trainings.map((item) => (
              <Box key={item._id} sx={{ width: "100%", maxWidth: 345 }}>
                <Button
                  onClick={() => navigate(`/training/${item._id}`)}
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "block",
                    textAlign: "left",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "1rem",
                  }}
                >
                  <Box>
                    <h4>{item.name}</h4>
                    <p>{item.description}</p>
                  </Box>
                </Button>
              </Box>
            ))
          ) : (
            <Alert severity="error">{t("noTrainingsAvailable")}</Alert>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default Trainings;
