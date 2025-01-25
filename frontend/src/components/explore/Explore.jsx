import React, { useState } from "react";
import {
  Container,
  Header,
  SectionHeader,
  ExploreNav,
  ExploreGrid,
  ExploreCard,
} from "./ExploreEl";
import { cardItems } from "./cardItems";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";

import { FaArrowRight } from "react-icons/fa";

const Card = ({ item }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // State to track whether card is hovered
  const [isHovered, setIsHovered] = useState(false);
  const [isHoveredLink, setIsHoveredLink] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  const handleMouseEnterLink = () => setIsHoveredLink(true);
  const handleMouseLeaveLink = () => setIsHoveredLink(false);

  const hoverStyle = {
    backgroundColor: isHovered
      ? colors.primary.extraLight
      : theme.palette.mode === "dark"
        ? colors.primary.light
        : colors.primary.extraLight,
    borderColor: isHovered ? colors.secondary.main : "transparent",
    transition: "background-color border-color 0.3s ease",
  };

  return (
    <ExploreCard
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={hoverStyle}
    >
      <span
        style={{
          backgroundColor: colors.secondary.dark,
          color: "#fff",
        }}
      >
        {item.icon}
      </span>
      <h4>{item.title}</h4>
      <p
        style={{
          color: colors.neutral.light,
        }}
      >
        {item.description}
      </p>
      <a
        href={item.link}
        onMouseEnter={handleMouseEnterLink}
        onMouseLeave={handleMouseLeaveLink}
        style={{
          color: isHoveredLink ? colors.secondary.hover : colors.neutral.main,
        }}
      >
        Join Now <FaArrowRight style={{ paddingLeft: "6px" }} />
      </a>
    </ExploreCard>
  );
};

const Explore = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Container>
      <Header>
        <SectionHeader
          style={{
            color:
              theme.palette.mode === "dark"
                ? colors.neutral.white
                : colors.neutral.light,
          }}
        >
          EXPLORE OUR PROGRAM
        </SectionHeader>
      </Header>
      <ExploreGrid>
        {cardItems.map((item, index) => (
          <Card key={index} item={item} />
        ))}
      </ExploreGrid>
    </Container>
  );
};

export default Explore;
