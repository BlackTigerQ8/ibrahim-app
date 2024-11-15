import styled from "styled-components";
import { Link } from "react-router-dom";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  z-index: 1000;
  width: 100%;
`;

export const StyledLink = styled(Link)`
  color: ${(props) => props.color};
  text-decoration: none;
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`;

export const HamburgerContainer = styled.div`
  position: sticky;
  top: 0;
  left: 1rem;
  z-index: 1000;
  padding: 0.5rem;
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
  gap: 2rem;
  align-items: flex-start;
  text-align: left;
  z-index: 1;
  padding-top: 4rem;
  padding-left: 5rem;
  transition: transform 0.3s ease-in-out;
  transform: translateX(${(props) => (props.isOpen ? "0" : "-100%")});
`;
