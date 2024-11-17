import styled from "styled-components";

export const Container = styled.div`
  max-width: var(--max-width);
  margin: auto;
  padding: 5rem 1rem;
  & > p {
    max-width: 600px;
    margin: auto;
    text-align: center;
    color: var(--text-light);
  }
`;

export const SectionHeader = styled.h2`
  margin-bottom: 1rem;
  font-size: 2.25rem;
  font-weight: 600;
  text-align: center;
`;

export const PriceGrid = styled.div`
  margin-top: 4rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const PriceCard = styled.div`
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  border: 2px solid transparent;
  border-radius: 10px;
  transition: 0.3s;

  & h4 {
    margin-bottom: 1rem;
    font-size: 1.2rem;
    font-weight: 500;
  }

  & h3 {
    padding-bottom: 1rem;
    margin-bottom: 2rem;
    font-size: 2rem;
    font-weight: 600;
  }

  & p {
    display: flex;
    align-items: center;
    margin-bottom: 0.75rem;
  }

  & p > span {
    display: flex;
    align-items: center;
    margin-right: 0.5rem;
    font-size: 1.2rem;
  }
`;

export const PriceCardContent = styled.div`
  flex: 1;
  margin-bottom: 2rem;
`;
