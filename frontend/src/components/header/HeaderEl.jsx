import styled from "styled-components";

export const Container = styled.div`
  position: relative;
  padding-top: 2rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  align-items: center;
  gap: 2rem;
  &::before {
    content: "IBRAHIM";
    position: absolute;
    bottom: 5rem;
    right: 20rem;
    font-size: 10rem;
    font-weight: 700;
    line-height: 7rem;
    color: #d79447;
    opacity: 0.1;
    z-index: -1;
  }
  max-width: var(--max-width);
  margin: auto;
  padding: 5rem 1rem;

  /* Media Queries for responsiveness */
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 3rem 1rem;
    &::before {
      font-size: 5rem;
      line-height: 4rem;
      bottom: 3.1rem;
      right: 1rem;
    }
  }
`;

export const SectionSubheader = styled.div`
  max-width: 600px;
  margin: auto;
  text-align: center;
  color: var(--text-light);
`;

export const HeaderContent = styled.div`
  margin-bottom: 1rem;
  font-size: 1rem;
  font-weight: 600;
  /* color: #f9ac54; */

  & > h1 {
    margin-bottom: 1rem;
    font-size: 5rem;
    font-weight: 700;
    line-height: 6rem;
    /* color: var(--white); */
  }

  & > h1 span {
    -webkit-text-fill-color: transparent;
    -webkit-text-stroke: 1px;
  }

  & > p {
    margin-bottom: 2rem;
    color: var(--text-light);
  }

  /* Media Queries for responsiveness */
  @media (max-width: 768px) {
    text-align: center;
    & > h1 {
      font-size: 2.5rem;
      line-height: 3rem;
    }
    & > p {
      font-size: 1rem;
      margin-bottom: 1.5rem;
    }
  }
`;

export const BackgroundBlur = styled.span`
  position: absolute;
  box-shadow: 0 0 1000px 50px;
  z-index: -1;
`;

export const HeaderBlur = styled.span`
  position: absolute;
  box-shadow: 0 0 1000px 50px;
  z-index: -1;
  bottom: 5rem;
  right: 0;
`;

export const Button = styled.button`
  padding: 1rem 2rem;
  outline: none;
  border: none;
  font-size: 1rem;
  color: var(--white);

  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;

  /* Media Queries for responsiveness */
  @media (max-width: 768px) {
    padding: 0.8rem 1.5rem;
    font-size: 0.9rem;
  }
`;

export const HeaderImage = styled.div`
  position: relative;
  & > img {
    max-width: 550px;
    margin: auto;
  }
  &::before {
    content: "o";
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    font-size: 40rem;
    font-weight: 400;
    line-height: 20rem;
    color: var(--secondary-color);
    opacity: 0.1;
    z-index: -1;
  }

  /* Media Queries for responsiveness */
  @media (max-width: 768px) {
    & > img {
      max-width: 100%;
    }
    &::before {
      font-size: 20rem;
      line-height: 10rem;
      top: 5rem;
    }
  }
`;
