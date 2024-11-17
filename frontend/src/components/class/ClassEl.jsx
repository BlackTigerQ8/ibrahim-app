import styled from "styled-components";

export const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  max-width: var(--max-width);
  margin: auto;
  padding: 5rem 1rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    padding: 3rem 1rem;
  }
`;

export const ClassImage = styled.div`
  position: relative;
`;

export const Image1 = styled.img`
  position: absolute;
  right: 0;
  top: 0;
  max-width: 500px;
  border-radius: 10px;

  @media (max-width: 1024px) {
    max-width: 100%;
    position: relative;
    margin-bottom: 1rem;
  }
`;

export const Image2 = styled.img`
  position: absolute;
  left: 0;
  bottom: 0;
  max-width: 300px;
  border-radius: 10px;

  @media (max-width: 1024px) {
    max-width: 100%;
    position: relative;
    margin-bottom: 1rem;
  }
`;

export const BackgroundBlur = styled.span`
  position: absolute;
  z-index: -1;
`;

export const Content = styled.div`
  padding: 2rem 0;

  & > p {
    margin-bottom: 4rem;
    color: var(--text-light);
  }

  @media (max-width: 1024px) {
    padding: 1rem 0;
  }
`;

export const SectionHeader = styled.h2`
  margin-bottom: 1rem;
  font-size: 2.25rem;
  font-weight: 600;
  text-align: left;
  max-width: 400px;

  @media (max-width: 768px) {
    font-size: 1.75rem;
    max-width: 100%;
    text-align: center;
  }
`;
