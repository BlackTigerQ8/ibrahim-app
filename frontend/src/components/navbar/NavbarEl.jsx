import styled, { keyframes, css } from "styled-components";
// import { Link } from "react-router-dom";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  z-index: 1000;
  width: 100%;
`;

export const HamburgerContainer = styled.div`
  position: sticky;
  top: 0;
  left: 1rem;
  z-index: 1000;
  padding: 0.5rem;
`;

export const ImageContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 4rem;
  flex-direction: column;
  align-items: center;
`;

export const Sidebar = styled.div`
  background-color: ${({ backgroundColor }) => backgroundColor};
  color: #ffffff;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 250px;
  display: flex;
  flex-direction: column;
  /* gap: 1rem; */
  padding: 2rem;
  align-items: flex-start;
  text-align: left;
  z-index: 1;
  transition: transform 0.3s ease-in-out;
  transform: translateX(${(props) => (props.isOpen ? "0" : "-100%")});
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100dvw;
  height: 100dvh;
  background-color: rgba(0, 0, 0, 0);
  z-index: 0;
  display: ${(props) => (props.isOpen ? "block" : "none")};
  transition: opacity 0.3s ease-in-out;
`;

// Add this new animation
const shakeAnimation = keyframes`
  0% { transform: rotate(0deg); }
  25% { transform: rotate(-10deg); }
  50% { transform: rotate(10deg); }
  75% { transform: rotate(-5deg); }
  100% { transform: rotate(0deg); }
`;

// Create a styled component for the icon wrapper
export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ $isHovered }) =>
    $isHovered &&
    css`
      animation: ${shakeAnimation} 0.5s ease;
    `}
`;
