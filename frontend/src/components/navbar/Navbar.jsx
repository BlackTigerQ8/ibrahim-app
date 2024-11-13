import React, { useState, useEffect } from "react";
import { Container, HamburgerContainer, Sidebar, StyledLink } from "./NavbarEl";
import Logo from "../../assets/Kuwait_Flag_Emoji.png";
import { Sling as Hamburger } from "hamburger-react";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";

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

  const handleToggle = () => {
    setOpen(!isOpen);
  };

  const closeMobileMenu = () => {
    setOpen(false);
  };

  // Apply blur effect to the body when the menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.filter = "blur(5px)";
      // Ensure the Navbar is not blurred
      document.getElementById("navbar").style.filter = "none";
    } else {
      document.body.style.filter = "none";
    }

    return () => {
      document.body.style.filter = "none"; // Clean up the effect when component unmounts
    };
  }, [isOpen]);

  // Temporary
  const user = false;

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
              to="/logout"
              onClick={closeMobileMenu}
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
