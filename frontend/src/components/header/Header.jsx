import React from "react";
import {
  Container,
  HeaderContent,
  BackgroundBlur,
  HeaderBlur,
  HeaderImage,
} from "./HeaderEl";
import { Button } from "@mui/material";
import HeaderImg from "../../assets/iheader.png";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";

const Header = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Container>
      <HeaderContent>
        <BackgroundBlur
          style={{
            color:
              theme.palette.mode === "dark"
                ? colors.secondary.main
                : colors.secondary.dark,
          }}
        ></BackgroundBlur>
        <HeaderBlur
          style={{
            color:
              theme.palette.mode === "dark"
                ? colors.secondary.main
                : colors.primary.main,
          }}
        ></HeaderBlur>
        <h4
          style={{
            color:
              theme.palette.mode === "dark"
                ? colors.secondary.main
                : colors.secondary.main,
          }}
        >
          BEST FITNESS IN THE TOWN
        </h4>
        <h1
          style={{
            color: colors.secondary.main,
          }}
        >
          <span
            style={{
              color: colors.neutral.light,
            }}
          >
            MAKE
          </span>{" "}
          YOUR BODY SHAPE
        </h1>
        <p
          style={{
            color: colors.neutral.light,
          }}
        >
          Unleash your potential and embark on a journey towards a stronger,
          fitter, and more confident you. Sign up for 'Make Your Body Shape' now
          and witness the incredible transformation your body is capable of!
        </p>
        <Button
          sx={{
            backgroundColor: colors.secondary.main,
            "&:hover": {
              backgroundColor: colors.secondary.dark,
            },
            color: colors.primary.main,
            padding: "1rem 2rem",
            fontSize: "1rem",
          }}
        >
          Get Started
        </Button>
      </HeaderContent>
      <HeaderImage>
        <img src={HeaderImg} alt="" />
      </HeaderImage>
    </Container>
  );
};

export default Header;
