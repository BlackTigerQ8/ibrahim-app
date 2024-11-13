import React from "react";
import {
  Container,
  ClassImage,
  Image1,
  Image2,
  BackgroundBlur,
  Content,
  SectionHeader,
  Button,
} from "./ClassEl";
import Class1 from "../../assets/class1.png";
import Class2 from "../../assets/class2.png";

const Class = () => {
  return (
    <>
      <Container>
        <ClassImage>
          <BackgroundBlur></BackgroundBlur>
          <Image1 src={Class1} />
          <Image2 src={Class2} />
        </ClassImage>
        <Content>
          <SectionHeader>THE CLASS YOU WILL GET HERE</SectionHeader>
          <p>
            Led by our team of expert and motivational instructors, "The Class
            You Will Get Here" is a high-energy, results-driven session that
            combines a perfect blend of cardio, strength training, and
            functional exercises. Each class is carefully curated to keep you
            engaged and challenged, ensuring you never hit a plateau in your
            fitness endeavors.
          </p>
          <Button>Book A Class</Button>
        </Content>
      </Container>
    </>
  );
};

export default Class;
