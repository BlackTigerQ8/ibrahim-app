import React, { useEffect, useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories, deleteCategory } from "../../redux/categorySlice";
import PlaceholderImage from "../../assets/JRG-1.png";

export default function Cards() {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const API_URL = process.env.REACT_APP_API_URL;
  const { categories, status, error } = useSelector((state) => state.category);
  const { userRole, userInfo } = useSelector((state) => state.user);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return PlaceholderImage;
    return `${API_URL}/${imagePath}`;
  };

  const handleUpdate = (categoryId) => {
    navigate(`/categories/edit/${categoryId}`);
  };

  const handleDelete = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setOpenDeleteModal(true);
  };

  const handleModalClose = (confirm) => {
    if (confirm && selectedCategoryId) {
      dispatch(deleteCategory(selectedCategoryId));
    }
    setOpenDeleteModal(false);
    setSelectedCategoryId(null);
  };

  if (status === "failed") {
    console.error("Error fetching categories:", error);
  }

  if (status === "loading") {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        bgcolor={theme.palette.background.default}
      >
        <div>
          <l-cardio size="70" speed="1.75" color={colors.secondary.main} />
        </div>
      </Box>
    );
  }

  if (status === "failed") {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: "2rem",
        justifyContent: isNonMobile ? "flex-start" : "center",
        margin: "2rem 0",
      }}
    >
      {categories.length > 0 ? (
        categories.map((item) => (
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
              onClick={() => navigate(`/categories/${item._id}/trainings`)}
            >
              <CardMedia
                sx={{ height: 140 }}
                component="img"
                crossOrigin="anonymous"
                image={(() => {
                  const url = getImageUrl(item.image);
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
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
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
                    color={"secondary"}
                    onClick={() => handleUpdate(item._id)}
                  >
                    {t("update")}
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(item._id)}
                  >
                    {t("delete")}
                  </Button>
                </Box>
                {/* Delete Confirmation Modal */}
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
                  <DialogTitle>{t("areYouSureDeleteCategory")}</DialogTitle>
                  <DialogActions>
                    <Button
                      onClick={() => handleModalClose(false)}
                      color="inherit"
                    >
                      {t("cancel")}
                    </Button>
                    <Button
                      onClick={() => handleModalClose(true)}
                      color="secondary"
                    >
                      {t("confirm")}
                    </Button>
                  </DialogActions>
                </Dialog>
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
            {t("noCategoriesAvailable")}
          </Alert>
        </Box>
      )}
    </Box>
  );
}
