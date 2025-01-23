import React, { useEffect, useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import { cardio } from "ldrs";
import { setUser } from "../../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, Container } from "@mui/material";
import { useTranslation } from "react-i18next";
import Title from "../../components/Title";
import Cards from "./Cards";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  // const isNonMobile = useMediaQuery("(min-width: 600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isLoading, setIsLoading] = useState(true);
  const savedToken = localStorage.getItem("token");
  const { userRole } = useSelector((state) => state.user);
  // const user = Boolean(savedToken);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      if (savedToken) {
        const savedUser = JSON.parse(localStorage.getItem("userInfo"));
        if (savedUser) {
          dispatch(setUser({ user: savedUser, token: savedToken }));
        }
      }
      setIsLoading(false);
    };

    checkUser();
  }, [dispatch, savedToken]);

  cardio.register();
  if (isLoading) {
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

  return (
    <Container>
      <Box>
        <Title title={t("CATEGORIES")} subtitle={t("trainingCategories")} />
        {(userRole === "Admin" || userRole === "Coach") && (
          <Box display="flex" justifyContent="start" margin="20px">
            <Button
              onClick={() => navigate("/category-form")}
              color="secondary"
              variant="contained"
            >
              {t("createNewCategory")}
            </Button>
          </Box>
        )}
        <Cards />
      </Box>
    </Container>
  );
};

export default Categories;
