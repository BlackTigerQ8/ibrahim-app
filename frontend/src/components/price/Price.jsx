import React, { useState } from "react";
import {
  Container,
  SectionHeader,
  PriceGrid,
  PriceCard,
  PriceCardContent,
} from "./PriceEl";
import { Button } from "@mui/material";
import { cardItems } from "./cardItems";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";

const Card = ({ item }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const features = Object.keys(item)
    .filter((key) => key.startsWith("feature"))
    .map((key) => item[key]);

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const hoverStyle = {
    backgroundColor: isHovered
      ? colors.primary.extraLight
      : theme.palette.mode === "dark"
      ? colors.primary.light
      : colors.primary.extraLight,
    borderColor: isHovered ? colors.secondary.main : "transparent",
    transition: "background-color border-color 0.3s ease",
  };

  const buttonStyle = {
    padding: "1rem 2rem",
    outline: "none",
    border: "2px solid",
    borderColor: colors.secondary.main,
    fontSize: "1rem",
    color: colors.secondary.main,
    backgroundColor: "transparent",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "0.3s",
    "&:hover": {
      color: colors.neutral.white,
      backgroundColor: colors.secondary.main,
    },
  };

  return (
    <PriceCard
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={hoverStyle}
    >
      <PriceCardContent
        style={{
          color: colors.neutral.light,
        }}
      >
        <h4>{item.title}</h4>
        <h3
          style={{
            borderBottom: `2px solid ${colors.neutral.light}`,
          }}
        >
          {item.price} KD
        </h3>
        {features.map((feature, index) => (
          <p key={index}>
            <span
              style={{
                color: colors.secondary.main,
              }}
            >
              {feature.icon}
            </span>{" "}
            {feature.text}
          </p>
        ))}
      </PriceCardContent>
      <Button sx={buttonStyle}>Join Now</Button>
    </PriceCard>
  );
};

const Price = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Container>
      <SectionHeader
        style={{
          color: colors.neutral.light,
        }}
      >
        OUR PRICING PLAN
      </SectionHeader>
      <p>
        Our pricing plan comes with various membership tiers, each tailored to
        cater to different preferences and fitness aspirations.
      </p>
      <PriceGrid>
        {cardItems.map((item, index) => (
          <Card key={index} item={item} />
        ))}
      </PriceGrid>
    </Container>
  );
};

export default Price;
