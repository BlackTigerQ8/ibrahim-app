import React, { useState, useEffect, useContext } from "react";
import { AppBar, Toolbar, IconButton, Typography, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import Logo from "../../assets/Kuwait_Flag_Emoji.png";
import { ColorModeContext } from "../../theme";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux"; // Import useDispatch
import { logoutUser } from "../../redux/userSlice";

const links = [
  { id: 1, title: "Home", url: "/" },
  { id: 2, title: "Schedules", url: "/schedules" },
  { id: 3, title: "About me", url: "/about" },
  { id: 4, title: "Contact", url: "/" },
];

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const dispatch = useDispatch();

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
    dispatch(logoutUser()); // Dispatch the logout action
    localStorage.removeItem("token"); // Optionally clear the token from localStorage
  };

  return (
    <AppBar
      position="sticky"
      style={{
        background: isScrolled
          ? "linear-gradient(to right, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.5))"
          : "inherit",
        backdropFilter: isScrolled ? "blur(10px)" : "none",
        transition: "background 0.3s, backdrop-filter 0.3s",
      }}
    >
      <Toolbar>
        <img src={Logo} alt="Logo" width={40} style={{ marginRight: "1rem" }} />
        <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
          Ibrahim
        </Typography>
        {links.map((item) => (
          <Button key={item.id} color="inherit" component={Link} to={item.url}>
            {item.title}
          </Button>
        ))}
        <IconButton onClick={colorMode.toggleColorMode} color="inherit">
          {theme.palette.mode === "dark" ? "🌙" : "☀️"}
        </IconButton>
        <Button color="inherit" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
