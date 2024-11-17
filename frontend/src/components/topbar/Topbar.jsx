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
  const savedToken = localStorage.getItem("token");
  const user = Boolean(savedToken);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
      sx={{
        background: isScrolled ? colors.primary.light : colors.primary.main,
        color:
          theme.palette.mode === "light"
            ? colors.neutral.light
            : colors.neutral.white,
        transition: "background 0.3s, color 0.3s",
        backdropFilter: isScrolled ? "blur(10px)" : "none",
      }}
    >
      <Toolbar>
        <img src={Logo} alt="Logo" width={40} style={{ marginRight: "1rem" }} />
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, color: colors.secondary.main }}
        >
          Ibrahim
        </Typography>
        <Box display="flex" alignItems="center">
          <Tooltip title={t("changeLanguage")}>
            <IconButton
              onClick={handleLanguageMenu}
              sx={{ color: colors.secondary.main }}
            >
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
          <Tooltip
            title={
              theme.palette.mode === "dark" ? t("lightMode") : t("darkMode")
            }
          >
            <IconButton onClick={colorMode.toggleColorMode}>
              {theme.palette.mode === "dark" ? (
                <DarkModeOutlinedIcon sx={{ color: colors.secondary.main }} />
              ) : (
                <LightModeOutlinedIcon sx={{ color: colors.secondary.main }} />
              )}
            </IconButton>
          </Tooltip>
        </Box>
        {links.map((item) => (
          <Button
            key={item.id}
            component={Link}
            to={item.url}
            sx={{
              color:
                theme.palette.mode === "dark"
                  ? colors.secondary.main
                  : colors.secondary.dark,
              textTransform: "capitalize",
              mx: 1,
            }}
          >
            {item.title}
          </Button>
        ))}
        {!user ? (
          <Button
            component={Link}
            to="/login"
            sx={{
              color: colors.secondary.main,
              background: colors.primary.extraLight,
              "&:hover": { background: colors.primary.light },
            }}
          >
            {t("login")}
          </Button>
        ) : (
          <Button
            component={Link}
            to="/"
            onClick={handleLogout}
            sx={{
              color: colors.secondary.main,
              background: colors.primary.extraLight,
              "&:hover": { background: colors.primary.light },
            }}
          >
            {t("logout")}
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
