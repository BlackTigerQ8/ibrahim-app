import React from "react";
import {
  Container,
  SectionHeader,
  JoinImage,
  JoinGrid,
  JoinCard,
  JoinCardContent,
} from "./JoinEl";
import joinImg from "../../assets/join1.png";
import { cardItems } from "./cardItems";

const Card = ({ item }) => {
  return (
    <JoinCard>
      <span>{item.icon}</span>
      <JoinCardContent>
        <h4>{item.title}</h4>
        <p>{item.description}</p>
      </JoinCardContent>
    </JoinCard>
  );
};

const Join = () => {
  return (
    <Container>
      <SectionHeader>WHY JOIN US?</SectionHeader>
      <p>
        Our diverse membership base creates a friendly and supportive
        atmosphere, where you can make friends and stay motivated.
      </p>
      <JoinImage>
        <img src={joinImg} alt="" />
        <JoinGrid>
          {cardItems.map((item, index) => (
            <Card key={index} item={item} />
          ))}
        </JoinGrid>
      </JoinImage>
    </Container>
  );
};

export default Join;
