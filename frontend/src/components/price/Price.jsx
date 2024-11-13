import React from "react";
import {
  Container,
  SectionHeader,
  PriceGrid,
  PriceCard,
  PriceCardContent,
  Button,
} from "./PriceEl";
import { cardItems } from "./cardItems";

const Card = ({ item }) => {
  const features = Object.keys(item)
    .filter((key) => key.startsWith("feature"))
    .map((key) => item[key]);

  return (
    <PriceCard>
      <PriceCardContent>
        <h4>{item.title}</h4>
        <h3>{item.price} KD</h3>
        {features.map((feature, index) => (
          <p key={index}>
            <span>{feature.icon}</span> {feature.text}
          </p>
        ))}
      </PriceCardContent>
      <Button>Join Now</Button>
    </PriceCard>
  );
};

const Price = () => {
  return (
    <Container>
      <SectionHeader>OUR PRICING PLAN</SectionHeader>
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
