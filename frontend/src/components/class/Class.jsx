import React from "react";
import {
  Container,
  ClassImage,
  Image1,
  Image2,
  BackgroundBlur,
  Content,
  SectionHeader,
} from "./ClassEl";
import { Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import Class1 from "../../assets/class1.png";
import Class2 from "../../assets/class2.png";

const Class = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <>
      <Container>
        <ClassImage>
          <BackgroundBlur
            style={{
              boxShadow: `0 0 1000px 50px ${colors.secondary.main}`,
            }}
          ></BackgroundBlur>
          <Image1 src={Class1} />
          <Image2 src={Class2} />
        </ClassImage>
        <Content>
          <SectionHeader style={{ color: colors.neutral.light }}>
            THE CLASS YOU WILL GET HERE
          </SectionHeader>
          <p style={{ color: colors.neutral.light }}>
            Led by our team of expert and motivational instructors, "The Class
            You Will Get Here" is a high-energy, results-driven session that
            combines a perfect blend of cardio, strength training, and
            functional exercises. Each class is carefully curated to keep you
            engaged and challenged, ensuring you never hit a plateau in your
            fitness endeavors.
          </p>
          <Button
            sx={{
              padding: "1rem 2rem",
              fontSize: "1rem",
              borderRadius: "5px",
              color: colors.neutral.white,
              backgroundColor: colors.secondary.main,
              "&:hover": {
                backgroundColor: colors.secondary.dark,
              },
              "@media (max-width: 768px)": {
                width: "100%",
                fontSize: "1.125rem",
              },
            }}
          >
            Book A Class
          </Button>
        </Content>
      </Container>
    </>
  );
};

export default Class;
