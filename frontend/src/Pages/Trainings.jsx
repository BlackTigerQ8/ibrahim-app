import React, { useEffect } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../theme";
import { cardio } from "ldrs";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Container,
  Alert,
  Typography,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import Title from "../components/Title";
import { useNavigate, useParams } from "react-router-dom";
import { fetchTrainings } from "../redux/trainingSlice";

const Trainings = () => {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { categoryId } = useParams();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const token =
    useSelector((state) => state.user.token) || localStorage.getItem("token");

  const { trainings, status, error } = useSelector((state) => state.training);

  console.log(trainings);

  useEffect(() => {
    if (categoryId) {
      dispatch(fetchTrainings({ token, categoryId }));
    }
  }, [dispatch, categoryId, token]);

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
      <Box>
        <Title title={t("TRAININGS")} subtitle={t("availableTrainings")} />
        <Box display="flex" justifyContent="space-between" margin="20px">
          <Button
            onClick={() => navigate(-1)}
            color="secondary"
            variant="contained"
          >
            {t("backToCategories")}
          </Button>

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
              <Card
                key={item._id}
                sx={{
                  maxWidth: 345,
                  flex: "1 1 calc(100% - 2rem)",
                  "@media (min-width: 600px)": {
                    flex: "1 1 calc(50% - 2rem)",
                  },
                }}
              >
                <CardActionArea
                  onClick={() =>
                    navigate(`/categories/${categoryId}/trainings/${item._id}`)
                  }
                >
                  <CardMedia
                    sx={{ height: 140 }}
                    image={item.image || "https://via.placeholder.com/345x140"}
                    title={item.name}
                  />
                  <CardContent>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="div"
                      color={colors.secondary.main}
                    >
                      {item.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {item.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))
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
              <Alert
                severity="error"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {t("noTrainingsAvailable")}
              </Alert>
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default Trainings;
