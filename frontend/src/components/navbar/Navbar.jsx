import React, { useState, useEffect, useContext, useRef } from "react";
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
  Typography,
  useTheme,
} from "@mui/material";
import { logoutUser } from "../../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { ColorModeContext } from "../../theme";
// Icons
import TranslateOutlinedIcon from "@mui/icons-material/TranslateOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import HomeIcon from "@mui/icons-material/Home";
import ScheduleIcon from "@mui/icons-material/Schedule";
import InfoIcon from "@mui/icons-material/Info";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import LoginIcon from "@mui/icons-material/Login";

const Navbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const colorMode = useContext(ColorModeContext);
  const [isOpen, setOpen] = useState(false);
  const [languageAnchorEl, setLanguageAnchorEl] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const userRole = useSelector((state) => state.user.userRole);

  const handleToggle = () => setOpen(!isOpen);
  const closeMobileMenu = () => setOpen(false);

  useEffect(() => {
    const pageContent = document.getElementById("page-content");
    if (isOpen) {
      if (pageContent) pageContent.style.filter = "blur(5px)";
      document.getElementById("navbar").style.filter = "none";
    } else if (pageContent) {
      pageContent.style.filter = "none";
    }

    return () => {
      if (pageContent) pageContent.style.filter = "none";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLanguageMenu = (event) =>
    setLanguageAnchorEl(event.currentTarget);
  const handleCloseLanguageMenu = () => setLanguageAnchorEl(null);

  const toggleLanguage = (language) => {
    i18n.changeLanguage(language);
    handleCloseLanguageMenu();
  };

  const hexToRgba = (hex, alpha = 1) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.clear();
    // window.location.reload();
  };

  const links = [
    { id: 1, title: t("home"), url: "/", icon: <HomeIcon /> },
    { id: 2, title: t("schedules"), url: "/schedules", icon: <ScheduleIcon /> },
    { id: 3, title: t("aboutMe"), url: "/about", icon: <InfoIcon /> },
    { id: 4, title: t("contact"), url: "/contact", icon: <ContactMailIcon /> },
  ];

  const savedToken = localStorage.getItem("token");
  const user = savedToken ? true : false;

  return (
    <Container
      style={{
        background: isScrolled
          ? hexToRgba(colors.primary.light, 0.6)
          : "transparent",
        backdropFilter: isScrolled ? "blur(10px)" : "none",
        transition: "background 0.3s, backdrop-filter 0.3s",
        color: colors.neutral.white,
      }}
    >
      <HamburgerContainer>
        <Hamburger
          id="hamburger"
          toggled={isOpen}
          toggle={handleToggle}
          style={{ zIndex: 50 }}
          color={
            theme.palette.mode === "dark"
              ? colors.secondary.main
              : colors.secondary.dark
          }
        />
      </HamburgerContainer>

      <div id="navbar">
        <Sidebar
          id="sidebar"
          isOpen={isOpen}
          style={{
            backgroundColor: colors.background.default,
            color:
              theme.palette.mode === "dark"
                ? colors.neutral.white
                : colors.primary.dark,
          }}
        >
          <img src={Logo} alt="Logo" width={100} />
          <Typography
            variant="h6"
            component="div"
            sx={{
              color: colors.secondary.main,
              textTransform: "uppercase",
              fontWeight: 900,
              fontSize: "18px",
            }}
          >
            {t(userRole)}
          </Typography>
          {links.map((item) => (
            <StyledLink
              style={{
                color:
                  theme.palette.mode === "dark"
                    ? colors.secondary.main
                    : colors.secondary.dark,
              }}
              to={item.url}
              key={item.id}
              onClick={closeMobileMenu}
            >
              <Box display="flex" alignItems="center">
                {item.icon}
                <span style={{ marginLeft: "8px" }}>{item.title}</span>
              </Box>
            </StyledLink>
          ))}

          {!user ? (
            <StyledLink
              style={{
                color:
                  theme.palette.mode === "dark"
                    ? colors.secondary.main
                    : colors.secondary.dark,
              }}
              to="/login"
              onClick={closeMobileMenu}
            >
              <Box display="flex" alignItems="center">
                <LoginIcon style={{ marginRight: "8px" }} />
                {t("login")}
              </Box>
            </StyledLink>
          ) : (
            <StyledLink
              style={{
                color:
                  theme.palette.mode === "dark"
                    ? colors.secondary.main
                    : colors.secondary.dark,
              }}
              to="#"
              onClick={handleLogout}
            >
              <Box display="flex" alignItems="center">
                <ExitToAppIcon style={{ marginRight: "8px" }} />
                {t("logout")}
              </Box>
            </StyledLink>
          )}

          <Box display="flex" color={colors.secondary.main}>
            <Tooltip
              title={
                theme.palette.mode === "dark" ? t("lightMode") : t("darkMode")
              }
            >
              <IconButton onClick={colorMode.toggleColorMode}>
                {theme.palette.mode === "dark" ? (
                  <DarkModeOutlinedIcon sx={{ color: colors.secondary.main }} />
                ) : (
                  <LightModeOutlinedIcon
                    sx={{ color: colors.secondary.dark }}
                  />
                )}
              </IconButton>
            </Tooltip>

            <Box display="flex" alignItems="center" justifyContent="center">
              <Tooltip title={t("changeLanguage")}>
                <IconButton onClick={handleLanguageMenu}>
                  <TranslateOutlinedIcon
                    sx={{
                      color:
                        theme.palette.mode === "dark"
                          ? colors.secondary.main
                          : colors.secondary.dark,
                    }}
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
