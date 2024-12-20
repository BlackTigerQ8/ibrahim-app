import React, { useEffect } from "react";
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
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../redux/categorySlice";
// import { getUserRoleFromToken } from "../../getUserRoleFromToken";

export default function Cards() {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token =
    useSelector((state) => state.user.token) || localStorage.getItem("token");
  const { categories, status, error } = useSelector((state) => state.category);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCategories());
    }
  }, [dispatch, status]);

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
      {categories.map((item, id) => (
        <Card
          key={id}
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
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {item.description}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Box>
  );
}
