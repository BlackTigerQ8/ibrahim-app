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

export const JoinImage = styled.div`
  margin-top: 4rem;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;

  & > img {
    border-radius: 10px;
    max-width: 100%; // Image will scale with its container *********FIX IT*********
    height: auto;
  }

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
  }
`;

export const JoinGrid = styled.div`
  position: absolute;
  bottom: -5rem;
  width: calc(100% - 4rem);
  padding: 2rem;
  margin: 0 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  border-radius: 10px;

  @media (max-width: 768px) {
    position: relative;
    width: 100%;
    gap: 0;
    bottom: -2rem;
  }

  & span {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    padding: 5px 12px;
    font-size: 1.75rem;
    border-radius: 5px;
  }
`;

export const JoinCard = styled.div`
  flex: 1 1 250px;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const JoinCardContent = styled.div`
  & > h4 {
    margin-bottom: 0.5rem;
    font-size: 1.2rem;
    font-weight: 500;
  }
`;
