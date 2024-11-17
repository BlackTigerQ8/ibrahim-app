import styled from "styled-components";

export const Container = styled.section`
  max-width: var(--max-width);
  margin: auto;
  padding: 5rem 1rem;

  @media (max-width: 768px) {
    padding: 3rem 1rem;
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const SectionHeader = styled.h2`
  margin-bottom: 1rem;
  font-size: 2.25rem;
  font-weight: 600;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

export const ExploreNav = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  & > span {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    padding: 0;
    font-size: 1.5rem;
    border: 2px solid;
    border-radius: 50%;
    cursor: pointer;
    transition: 0.3s;
  }

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

export const ExploreGrid = styled.div`
  margin-top: 4rem;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const ExploreCard = styled.div`
  padding: 1rem;
  border: 2px solid transparent;
  border-radius: 10px;
  transition: 0.3s;

  & > span {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    font-size: 1.75rem;
    border-radius: 5px;
    margin-bottom: 1rem;
  }
  & > h4 {
    margin-bottom: 0.5rem;
    font-size: 1.2rem;
    font-weight: 600;

    @media (max-width: 768px) {
      font-size: 1rem;
    }
  }

  & > p {
    margin-bottom: 1rem;
  }

  & > a {
    display: flex;
    align-items: center;
    color: var(--white);
    transition: 0.3s;
  }
`;
