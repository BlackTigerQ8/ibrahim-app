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
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";

const Card = ({ item }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <JoinCard>
      <span
        style={{
          backgroundColor: colors.secondary.dark,
          color: colors.neutral.white,
        }}
      >
        {item.icon}
      </span>
      <JoinCardContent
        style={{
          color: colors.neutral.light,
        }}
      >
        <h4>{item.title}</h4>
        <p>{item.description}</p>
      </JoinCardContent>
    </JoinCard>
  );
};

const Join = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Container>
      <SectionHeader>WHY JOIN US?</SectionHeader>
      <p style={{ color: colors.neutral.light }}>
        Our diverse membership base creates a friendly and supportive
        atmosphere, where you can make friends and stay motivated.
      </p>
      <JoinImage>
        <img src={joinImg} alt="" />
        <JoinGrid
          style={{
            backgroundColor:
              theme.palette.mode === "dark"
                ? colors.primary.light
                : colors.primary.extraLight,
          }}
        >
          {cardItems.map((item, index) => (
            <Card key={index} item={item} />
          ))}
        </JoinGrid>
      </JoinImage>
    </Container>
  );
};

export default Join;
