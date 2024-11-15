import React, { useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../theme";
import { cardio } from "ldrs";

const Coach = () => {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100dvh",
        color: colors.sunset[500],
      }}
    >
      Coach
    </div>
  );
};

export default Coach;
