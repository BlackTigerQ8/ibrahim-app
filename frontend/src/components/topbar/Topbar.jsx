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
  Dialog,
  DialogActions,
  DialogTitle,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import Logo from "../../assets/Kuwait_Flag_Emoji.png";
import { ColorModeContext } from "../../theme";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/userSlice";
import TranslateOutlinedIcon from "@mui/icons-material/TranslateOutlined";
import { useTranslation } from "react-i18next";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import Avatar from "../../assets/avatar.jpg";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [languageAnchorEl, setLanguageAnchorEl] = useState(null);
  const savedToken = localStorage.getItem("token");
  const user = Boolean(savedToken);
  const userRole = useSelector((state) => state.user.userRole);
  const currentUser = useSelector((state) => state.user.userInfo);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const { userInfo } = useSelector((state) => state.user);
  const API_URL = process.env.REACT_APP_API_URL;
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (userInfo?.image) {
      const imageUrl = `${API_URL}/${userInfo.image}`;
      setProfileImage(imageUrl);
    }
  }, [userInfo, API_URL]);

  const handleLogout = () => {
    setOpenModal(true);
  };

  const handleModalClose = (confirm) => {
    if (confirm) {
      dispatch(logoutUser());
      localStorage.clear();
      navigate("/");
    }
    setOpenModal(false);
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
    { id: 2, title: t("aboutMe"), url: "/about" },
    { id: 3, title: t("contact"), url: "/contact" },
    { id: 4, title: t("categories"), url: "/categories" },
  ];

  // Only add Profile link if the user is logged in
  if (user) {
    links.push({
      id: 5,
      title: t("profile"),
      url: currentUser?._id ? `/profile/${currentUser._id}` : "/login",
    });
  }

  // Only add CategoryForm link if the user is Admin
  if (userRole === "Admin") {
    links.push(
      {
        id: 6,
        title: t("calendar"),
        url: "/calendar",
      },
      {
        id: 7,
        title: t("users"),
        url: "/users",
      }
    );
  }

  const hexToRgba = (hex, alpha = 1) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        background: isScrolled
          ? hexToRgba(colors.primary.light, 0.6)
          : hexToRgba(colors.primary.main, 0.6),
        color:
          theme.palette.mode === "light"
            ? colors.neutral.light
            : colors.neutral.white,
        transition: "background 0.3s, color 0.3s",
        backdropFilter: isScrolled ? "blur(10px)" : "none",
      }}
    >
      <Toolbar>
        <img
          crossOrigin="anonymous"
          src={profileImage || Avatar}
          alt={t("profileImage")}
          width={60}
          style={{
            margin: ".5rem",
            borderRadius: "50%",
            border: `2px solid ${colors.secondary.main}`,
          }}
        />
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            color: colors.secondary.main,
            textTransform: "uppercase",
          }}
        >
          {t(userRole)}
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
        <Dialog open={openModal} onClose={() => setOpenModal(false)}>
          <DialogTitle>{t("areYouSureLogout")}</DialogTitle>
          <DialogActions>
            <Button onClick={() => handleModalClose(false)} color="inherit">
              {t("cancel")}
            </Button>
            <Button onClick={() => handleModalClose(true)} color="secondary">
              {t("confirm")}
            </Button>
          </DialogActions>
        </Dialog>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
