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
  color: var(--white);
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
  background-color: var(--primary-color-light);
  border: 2px solid transparent;
  border-radius: 10px;
  transition: 0.3s;

  &:hover {
    background-color: var(--primary-color-extra-light);
    border-color: var(--secondary-color);
  }

  & h4 {
    margin-bottom: 1rem;
    font-size: 1.2rem;
    font-weight: 500;
    color: var(--white);
  }

  & h3 {
    padding-bottom: 1rem;
    margin-bottom: 2rem;
    font-size: 2rem;
    font-weight: 600;
    color: var(--white);
    border-bottom: 2px solid var(--white);
  }

  & p {
    display: flex;
    align-items: center;
    margin-bottom: 0.75rem;
    color: var(--white);
  }

  & p > span {
    display: flex;
    align-items: center;
    margin-right: 0.5rem;
    font-size: 1.2rem;
    color: var(--secondary-color);
  }
`;

export const PriceCardContent = styled.div`
  flex: 1;
  margin-bottom: 2rem;
`;

export const Button = styled.button`
  padding: 1rem 2rem;
  outline: none;
  border: none;
  font-size: 1rem;
  color: var(--secondary-color);
  background-color: transparent;
  border: 2px solid var(--secondary-color);
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    color: var(--white);
    background-color: var(--secondary-color);
  }
`;
