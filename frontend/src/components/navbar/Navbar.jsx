import React, { useState, useEffect } from "react";
import { Container, HamburgerContainer, Sidebar, StyledLink } from "./NavbarEl";
import Logo from "../../assets/Kuwait_Flag_Emoji.png";
import { Sling as Hamburger } from "hamburger-react";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

const links = [
  { id: 1, title: "Home", url: "/" },
  { id: 2, title: "Schedules", url: "/schedules" },
  { id: 3, title: "About me", url: "/about" },
  { id: 4, title: "Contact", url: "/" },
];

const Navbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isOpen, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleToggle = () => {
    setOpen(!isOpen);
  };

  const closeMobileMenu = () => {
    setOpen(false);
  };

  // Apply blur effect to the body when the menu is open
  useEffect(() => {
    const pageContent = document.getElementById("page-content");
    if (isOpen) {
      if (pageContent) {
        pageContent.style.filter = "blur(5px)";
      }
      // Ensure the Navbar is not blurred
      document.getElementById("navbar").style.filter = "none";
    } else {
      if (pageContent) {
        pageContent.style.filter = "none";
      }
    }

    return () => {
      document.body.style.filter = "none"; // Clean up the effect when component unmounts
    };
  }, [isOpen]);

  // Check if the user is logged in by checking for a token
  const savedToken = localStorage.getItem("token");
  const user = savedToken ? true : false;

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    closeMobileMenu();
    navigate("/login");
  };

  return (
    <Container>
      <HamburgerContainer>
        <Hamburger
          toggled={isOpen}
          toggle={handleToggle}
          style={{ zIndex: 20 }}
          color={colors.buff[500]}
        />
      </HamburgerContainer>

      {/* The Navbar itself should not be blurred */}
      <div id="navbar">
        <Sidebar isOpen={isOpen} backgroundColor={colors.black[400]}>
          <img src={Logo} width={50} />
          {links.map((item) => (
            <StyledLink
              color={colors.sunset[700]}
              to={item.url}
              key={item.id}
              onClick={closeMobileMenu}
            >
              {item.title}
            </StyledLink>
          ))}

          {!user ? (
            <StyledLink
              color={colors.sunset[700]}
              to="/login"
              onClick={closeMobileMenu}
            >
              Login
            </StyledLink>
          ) : (
            <StyledLink
              color={colors.sunset[700]}
              to="#"
              onClick={(e) => {
                e.preventDefault();
                logout();
              }}
            >
              Logout
            </StyledLink>
          )}
        </Sidebar>
      </div>
    </Container>
  );
};

export default Navbar;
