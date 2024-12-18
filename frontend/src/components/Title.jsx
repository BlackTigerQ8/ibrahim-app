import React from "react";
import { Typography, Box, useTheme } from "@mui/material";
import { tokens } from "../theme";

const Title = ({ title, subtitle }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box mb="10px" p="4rem 0 1rem 2rem">
      <Typography
        variant="h2"
        color={colors.secondary.main}
        fontWeight="bold"
        sx={{ mb: "5px" }}
      >
        {title}
      </Typography>
      <Typography variant="h5" color={colors.secondary.main}>
        {subtitle}
      </Typography>
    </Box>
  );
};

export default Title;
