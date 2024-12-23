import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  HamburgerContainer,
  Sidebar,
  Overlay,
  ImageContainer,
  IconWrapper,
} from "./NavbarEl";
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
  Dialog,
  DialogActions,
  DialogTitle,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { logoutUser } from "../../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { ColorModeContext } from "../../theme";
// Icons
import TranslateOutlinedIcon from "@mui/icons-material/TranslateOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import PeopleIcon from "@mui/icons-material/People";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HomeIcon from "@mui/icons-material/Home";
import ScheduleIcon from "@mui/icons-material/Schedule";
import InfoIcon from "@mui/icons-material/Info";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import LoginIcon from "@mui/icons-material/Login";
import { useNavigate, Link } from "react-router-dom";
import Avatar from "../../assets/avatar.jpg";

const Navbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const colorMode = useContext(ColorModeContext);
  const [isOpen, setOpen] = useState(false);
  const [languageAnchorEl, setLanguageAnchorEl] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const userRole = useSelector((state) => state.user.userRole);
  const { userInfo } = useSelector((state) => state.user);
  const savedToken = localStorage.getItem("token");
  const user = savedToken ? true : false;
  const [openModal, setOpenModal] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL;
  const [profileImage, setProfileImage] = useState("");

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

  useEffect(() => {
    // Reset modal state if user logs back in
    if (savedToken) {
      setOpenModal(false); // Close the modal if the user is logged in
    }
  }, [savedToken]); // Depend on savedToken to trigger the effect when the login state changes

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
      closeMobileMenu();
      localStorage.clear();
      navigate("/");
    }
    setOpenModal(false);
  };

  const links = [
    { id: 1, title: t("home"), url: "/", icon: <HomeIcon /> },
    { id: 2, title: t("aboutMe"), url: "/about", icon: <InfoIcon /> },

    {
      id: 3,
      title: t("categories"),
      url: "/categories",
      icon: <ScheduleIcon />,
    },
    { id: 4, title: t("contact"), url: "/contact", icon: <ContactMailIcon /> },
  ];

  // Only add Profile link if the user is logged in
  if (user) {
    links.push({
      id: 5,
      title: t("profile"),
      url: userInfo?._id ? `/profile/${userInfo._id}` : "/login",
      icon: <AccountCircleIcon />,
    });
  }

  // Only add CategoryForm link if the user is Admin
  if (userRole === "Admin") {
    links.push(
      {
        id: 6,
        title: t("calendar"),
        url: "/calendar",
        icon: <CalendarMonthOutlinedIcon />,
      },
      {
        id: 7,
        title: t("users"),
        url: "/users",
        icon: <PeopleIcon />,
      }
    );
  }

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
      <Overlay $isOpen={isOpen} onClick={closeMobileMenu} />
      <div id="navbar">
        <Sidebar
          id="sidebar"
          $isOpen={isOpen}
          style={{
            zIndex: 49,
            backgroundColor: colors.background.default,
            color:
              theme.palette.mode === "dark"
                ? colors.neutral.white
                : colors.primary.dark,
          }}
        >
          {user ? (
            <ImageContainer>
              <img
                crossOrigin="anonymous"
                src={profileImage || Avatar}
                alt={t("profileImage")}
                style={{
                  width: 100,
                  height: 100,
                  marginBottom: "16px",
                  borderRadius: "50%",
                  border: `2px solid ${colors.secondary.main}`,
                }}
              />
              <Typography
                variant="h6"
                component="div"
                sx={{
                  color: colors.secondary.main,
                  textTransform: "uppercase",
                  fontWeight: 900,
                  fontSize: "18px",
                  marginTop: "1rem",
                }}
              >
                {t(userRole)}
              </Typography>
            </ImageContainer>
          ) : (
            <ImageContainer></ImageContainer>
          )}

          <List>
            {links.map((item) => (
              <ListItem
                key={item.id}
                component={Link}
                to={item.url}
                onClick={closeMobileMenu}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                sx={{
                  padding: "12px 16px",
                  margin: "4px 0",
                  borderRadius: "8px",
                  width: "100%",
                  alignItems: "center",
                  gap: "12px",
                  color:
                    theme.palette.mode === "dark"
                      ? colors.secondary.main
                      : colors.secondary.dark,
                  "&:hover": {
                    backgroundColor: colors.primary.extraLight,
                    color: colors.secondary.hover,
                  },
                }}
              >
                <IconWrapper $isHovered={hoveredItem === item.id}>
                  {item.icon}
                </IconWrapper>
                <ListItemText
                  primary={item.title}
                  sx={{
                    marginLeft: "8px",
                    fontWeight: 500,
                    fontSize: "14px",
                  }}
                />
              </ListItem>
            ))}

            {!user ? (
              <ListItem
                component={Link}
                to="/login"
                onClick={closeMobileMenu}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  padding: "12px 16px",
                  margin: "8px 0",
                  borderRadius: "8px",
                  width: "100%",
                  color:
                    theme.palette.mode === "dark"
                      ? colors.secondary.main
                      : colors.secondary.dark,
                  "&:hover": {
                    backgroundColor: colors.primary.extraLight,
                    color: colors.secondary.hover,
                  },
                }}
              >
                <LoginIcon style={{ marginRight: "8px" }} />
                {t("login")}
              </ListItem>
            ) : (
              <ListItem
                component={Link}
                onClick={handleLogout}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  padding: "12px 16px",
                  margin: "8px 0",
                  borderRadius: "8px",
                  cursor: "pointer",
                  color:
                    theme.palette.mode === "dark"
                      ? colors.secondary.main
                      : colors.secondary.dark,
                  "&:hover": {
                    backgroundColor: colors.primary.extraLight,
                    color: colors.secondary.hover,
                  },
                  width: "100%",
                }}
              >
                <ExitToAppIcon style={{ marginRight: "8px" }} />
                {t("logout")}
              </ListItem>
            )}
          </List>

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
      {/* Modal for Logout confirmation */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="confirm-logout"
      >
        <DialogTitle id="confirm-logout">{t("areYouSureLogout")}</DialogTitle>
        <DialogActions>
          <Button onClick={() => handleModalClose(false)} color="inhert">
            {t("cancel")}
          </Button>
          <Button
            onClick={() => handleModalClose(true)}
            color="secondary"
            autoFocus
          >
            {t("confirm")}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Navbar;
