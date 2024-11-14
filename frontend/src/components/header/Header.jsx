import React, { useContext } from "react";
import {
  Container,
  SectionSubheader,
  HeaderContent,
  BackgroundBlur,
  HeaderBlur,
  Button,
  HeaderImage,
} from "./HeaderEl";
import HeaderImg from "../../assets/iheader.png";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";

const Header = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Container>
      <HeaderContent>
        <BackgroundBlur></BackgroundBlur>
        <HeaderBlur></HeaderBlur>
        <h4>BEST FITNESS IN THE TOWN</h4>
        <h1>
          <span>MAKE</span> YOUR BODY SHAPE
        </h1>
        <p>
          Unleash your potential and embark on a journey towards a stronger,
          fitter, and more confident you. Sign up for 'Make Your Body Shape' now
          and witness the incredible transformation your body is capable of!
        </p>
        <Button color={colors.black[100]}>Get Started</Button>
      </HeaderContent>
      <HeaderImage>
        <img src={HeaderImg} alt="" />
      </HeaderImage>
    </Container>
  );
};

export default Header;
