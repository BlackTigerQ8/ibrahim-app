import React from "react";
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
import { cardio } from "ldrs";

cardio.register();

const Header = () => {
  return (
    <>
      {/* <l-cardio size="60" stroke="4" speed="1.5" color="black"></l-cardio> */}
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
            fitter, and more confident you. Sign up for 'Make Your Body Shape'
            now and witness the incredible transformation your body is capable
            of!
          </p>
          <Button>Get Started</Button>
        </HeaderContent>
        <HeaderImage>
          <img src={HeaderImg} alt="" />
        </HeaderImage>
      </Container>
    </>
  );
};

export default Header;
