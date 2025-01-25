import React, { useEffect, useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
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
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import Title from "../../components/Title";
import { useNavigate, useParams } from "react-router-dom";
import { deleteTraining, fetchTrainings } from "../../redux/trainingSlice";
import PlaceholderImage from "../../assets/JRG-1.png";

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
  const { userRole } = useSelector((state) => state.user);
  const { trainings, status, error } = useSelector((state) => state.training);
  const { categories } = useSelector((state) => state.category);
  const category = categories.find((cat) => cat._id === categoryId);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedTrainingId, setSelectedTrainingId] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (categoryId) {
      dispatch(fetchTrainings({ token, categoryId }));
    }
  }, [dispatch, categoryId, token]);

  const handleUpdate = (trainingId) => {
    navigate(`/categories/${categoryId}/trainings/edit/${trainingId}`);
  };

  const handleDelete = (trainingId) => {
    setSelectedTrainingId(trainingId);
    setOpenDeleteModal(true);
  };

  const handleModalClose = (confirm) => {
    if (confirm && selectedTrainingId) {
      dispatch(deleteTraining(selectedTrainingId));
    }
    setOpenDeleteModal(false);
    setSelectedTrainingId(null);
  };

  const isVideo = (imagePath) => {
    return imagePath?.toLowerCase().match(/\.(mp4|mov|avi|_compressed\.mp4)$/i);
  };

  const getMediaUrl = (imagePath) => {
    if (!imagePath) return PlaceholderImage;
    // If it's a video, return placeholder
    if (isVideo(imagePath)) return PlaceholderImage;
    // Otherwise return the image URL
    return `${API_URL}/${imagePath}`;
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

  return (
    <Container>
      <Box>
        <Title
          title={category ? category.name : t("TRAININGS")}
          subtitle={t("availableTrainings")}
        />
        <Box display="flex" justifyContent="space-between" margin="20px">
          <Button
            onClick={() => navigate(-1)}
            color="secondary"
            variant="contained"
          >
            {t("backToCategories")}
          </Button>

          {(userRole === "Admin" || userRole === "Coach") && (
            <Button
              onClick={() =>
                navigate(`/categories/${categoryId}/trainings/training-form`)
              }
              color="secondary"
              variant="contained"
            >
              {t("createNewTraining")}
            </Button>
          )}
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
                    component="img"
                    crossOrigin="anonymous"
                    image={(() => {
                      const url = getMediaUrl(item.image);
                      return url;
                    })()}
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
                {(userRole === "Admin" || userRole === "Coach") && (
                  <>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "0.5rem 1rem",
                      }}
                    >
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdate(item._id);
                        }}
                      >
                        {t("update")}
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item._id);
                        }}
                      >
                        {t("delete")}
                      </Button>
                    </Box>
                  </>
                )}
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
      <Dialog
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        BackdropProps={{
          style: { backgroundColor: "rgba(0, 0, 0, 0.05)" },
        }}
        PaperProps={{
          style: { boxShadow: "none" },
        }}
      >
        <DialogTitle>{t("deleteTrainingConfirmation")}</DialogTitle>
        <DialogActions>
          <Button onClick={() => handleModalClose(false)} color="inherit">
            {t("cancel")}
          </Button>
          <Button onClick={() => handleModalClose(true)} color="secondary">
            {t("confirm")}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Trainings;
