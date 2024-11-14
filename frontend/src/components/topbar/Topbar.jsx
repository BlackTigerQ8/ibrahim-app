import React, { useState, useEffect, useContext } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Tooltip,
  MenuItem,
  Menu,
  Box,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import Logo from "../../assets/Kuwait_Flag_Emoji.png";
import { ColorModeContext } from "../../theme";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../redux/userSlice";
import TranslateOutlinedIcon from "@mui/icons-material/TranslateOutlined";
import { useTranslation } from "react-i18next";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const [languageAnchorEl, setLanguageAnchorEl] = useState(null);

  // Check if the user is logged in by checking for a token
  const savedToken = localStorage.getItem("token");
  const user = savedToken ? true : false;

  // State to track if the page is scrolled
  const [isScrolled, setIsScrolled] = useState(false);

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

  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.clear();
    window.location.reload();
  };

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

  const links = [
    { id: 1, title: t("home"), url: "/" },
    { id: 2, title: t("schedules"), url: "/schedules" },
    { id: 3, title: t("aboutMe"), url: "/about" },
    { id: 4, title: t("contact"), url: "/contact" },
  ];

  return (
    <AppBar
      position="sticky"
      style={{
        background: isScrolled
          ? theme.palette.mode === "light"
            ? "rgba(255, 255, 255, 0.6)"
            : "rgba(0, 0, 0, 0.6)"
          : theme.palette.mode === "light"
          ? "#ffffff"
          : colors.black[500],
        backdropFilter: isScrolled ? "blur(10px)" : "none",
        transition: "background 0.3s, backdrop-filter 0.3s",
        color: colors.black[100],
      }}
    >
      <Toolbar>
        <img src={Logo} alt="Logo" width={40} style={{ marginRight: "1rem" }} />
        <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
          Ibrahim
        </Typography>
        <Box display="flex" alignItems="center" justifyContent="center">
          <Tooltip title={t("changeLanguage")}>
            <IconButton onClick={handleLanguageMenu}>
              <TranslateOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={languageAnchorEl}
            open={Boolean(languageAnchorEl)}
            onClose={handleCloseLanguageMenu}
          >
            <MenuItem onClick={() => toggleLanguage("en")}>English</MenuItem>
            <MenuItem onClick={() => toggleLanguage("ar")}>العربية</MenuItem>
          </Menu>
        </Box>
        {/* Dark/Light Mode Toggle */}
        <Tooltip
          title={theme.palette.mode === "dark" ? t("lightMode") : t("darkMode")}
        >
          <IconButton onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlinedIcon />
            ) : (
              <LightModeOutlinedIcon />
            )}
          </IconButton>
        </Tooltip>
        {links.map((item) => (
          <Button key={item.id} color="inherit" component={Link} to={item.url}>
            {item.title}
          </Button>
        ))}

        {!user ? (
          <Button
            color={colors.sunset[700]}
            to="/login"
            // onClick={closeMobileMenu}
          >
            {t("login")}
          </Button>
        ) : (
          <Button color={colors.sunset[700]} to="#" onClick={handleLogout}>
            {t("logout")}
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
