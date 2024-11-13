import React from "react";
import {
  Container,
  Header,
  SectionHeader,
  ExploreNav,
  ExploreGrid,
  ExploreCard,
} from "./ExploreEl";
import { cardItems } from "./cardItems";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const Card = ({ item }) => {
  return (
    <ExploreCard>
      <span>{item.icon}</span>
      <h4>{item.title}</h4>
      <p>{item.description}</p>
      <a href={item.link}>
        Join Now <FaArrowRight style={{ paddingLeft: "6px" }} />
      </a>
    </ExploreCard>
  );
};

const Explore = () => {
  return (
    <Container>
      <Header>
        <SectionHeader>EXPLORE OUR PROGRAM</SectionHeader>
        <ExploreNav>
          <span>
            <FaArrowLeft />
          </span>
          <span>
            <FaArrowRight />
          </span>
        </ExploreNav>
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
