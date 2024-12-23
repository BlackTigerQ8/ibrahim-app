import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
const NotFound = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="80vh"
      gap={2}
    >
      <Typography variant="h1">{404}</Typography>
      <Typography variant="h4">{t("pageNotFound")}</Typography>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => navigate("/")}
      >
        {t("backToHome")}
      </Button>
    </Box>
  );
};
export default NotFound;
