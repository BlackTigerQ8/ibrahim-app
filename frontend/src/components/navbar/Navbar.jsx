import React, { useState, useEffect, useRef, useContext } from "react";
import { Container, HamburgerContainer, Sidebar, StyledLink } from "./NavbarEl";
import Logo from "../../assets/Kuwait_Flag_Emoji.png";
import { Sling as Hamburger } from "hamburger-react";
import { tokens } from "../../theme";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  useTheme,
} from "@mui/material";
import { logoutUser } from "../../redux/userSlice";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { ColorModeContext } from "../../theme";
import TranslateOutlinedIcon from "@mui/icons-material/TranslateOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";

const Navbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const colorMode = useContext(ColorModeContext);
  const [isOpen, setOpen] = useState(false);
  const [languageAnchorEl, setLanguageAnchorEl] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

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

  const handleLanguageMenu = (event) => {
    setLanguageAnchorEl(event.currentTarget);
  };

  const handleCloseLanguageMenu = () => {
    setLanguageAnchorEl(null);
  };

  const toggleLanguage = (language) => {
    i18n.changeLanguage(language);
    handleCloseLanguageMenu();
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.clear();
    window.location.reload();
  };

  const links = [
    { id: 1, title: t("home"), url: "/" },
    { id: 2, title: t("schedules"), url: "/schedules" },
    { id: 3, title: t("aboutMe"), url: "/about" },
    { id: 4, title: t("contact"), url: "/contact" },
  ];

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Container
      style={{
        background: isScrolled
          ? theme.palette.mode === "light"
            ? "rgba(255, 255, 255, 0.6)"
            : "rgba(0, 0, 0, 0.6)"
          : theme.palette.mode === "light"
          ? "none"
          : "none",
        backdropFilter: isScrolled ? "blur(10px)" : "none",
        transition: "background 0.3s, backdrop-filter 0.3s",
        color: colors.black[100],
      }}
    >
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
          <img src={Logo} width={100} />
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
              {t("login")}
            </StyledLink>
          ) : (
            <StyledLink
              color={colors.sunset[700]}
              to="#"
              onClick={handleLogout}
            >
              {t("logout")}
            </StyledLink>
          )}

          <Box display="flex" color={colors.buff[500]}>
            <Tooltip
              title={
                theme.palette.mode === "dark" ? t("lightMode") : t("darkMode")
              }
            >
              <IconButton onClick={colorMode.toggleColorMode}>
                {theme.palette.mode === "dark" ? (
                  <DarkModeOutlinedIcon
                    onClick={closeMobileMenu}
                    style={{ color: colors.sunset[700] }}
                  />
                ) : (
                  <LightModeOutlinedIcon
                    onClick={closeMobileMenu}
                    style={{ color: colors.sunset[700] }}
                  />
                )}
              </IconButton>
            </Tooltip>

            <Box display="flex" alignItems="center" justifyContent="center">
              <Tooltip title={t("changeLanguage")}>
                <IconButton onClick={handleLanguageMenu}>
                  <TranslateOutlinedIcon
                    style={{ color: colors.sunset[700] }}
                  />
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={languageAnchorEl}
                open={Boolean(languageAnchorEl)}
                onClose={handleCloseLanguageMenu}
              >
                <MenuItem onClick={() => toggleLanguage("en")}>
                  English
                </MenuItem>
                <MenuItem onClick={() => toggleLanguage("ar")}>
                  العربية
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </Sidebar>
      </div>
    </Container>
  );
};

export default Navbar;
