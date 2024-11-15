import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/userSlice";
import { tokens } from "../theme";
import { cardio } from "ldrs";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTranslation } from "react-i18next";
import TranslateOutlinedIcon from "@mui/icons-material/TranslateOutlined";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [languageAnchorEl, setLanguageAnchorEl] = useState(null);

  const { status, error } = useSelector((state) => state.user);
  const colors = tokens(theme.palette.mode);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const lowercaseCredentials = {
      ...credentials,
      email: credentials.email.toLowerCase(),
    };
    dispatch(loginUser(lowercaseCredentials));
  };

  // Redirect to "/" when login is successful
  useEffect(() => {
    if (status === "succeeded") {
      navigate("/"); // Redirect to the home route
    }
  }, [status, navigate]);

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

  cardio.register();
  if (status === "loading") {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <l-cardio size="70" speed="1.75" color={colors.sunset[500]}></l-cardio>
      </div>
    );
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor={theme.palette.background.default}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          color: colors.sunset[100],
        }}
      >
        {t("login")}
      </Typography>
      {status === "failed" && (
        <Typography
          color="error"
          variant="body2"
          style={{ marginTop: 16, marginBottom: 16 }}
        >
          {error}
        </Typography>
      )}
      <Box
        component="form"
        onSubmit={handleSubmit}
        style={{ width: "100%", maxWidth: 400 }}
      >
        <TextField
          label={t("email")}
          name="email"
          value={credentials.email}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
          fullWidth
          inputProps={{ autoCapitalize: "none" }}
          sx={{
            ".MuiTextField-root": {
              marginBottom: 2,
            },
            ".MuiButton-root": {
              marginTop: 2,
            },
            ".MuiOutlinedInput-root": {
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: colors.sunset[700],
              },
            },
            ".MuiInputLabel-root.Mui-focused": {
              color: colors.sunset[100],
            },
          }}
        />
        <TextField
          label={t("password")}
          name="password"
          type="password"
          value={credentials.password}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
          fullWidth
          sx={{
            ".MuiTextField-root": {
              marginBottom: 2,
            },
            ".MuiButton-root": {
              marginTop: 2,
            },
            ".MuiOutlinedInput-root": {
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: colors.sunset[700],
              },
            },
            ".MuiInputLabel-root.Mui-focused": {
              color: colors.sunset[100],
            },
          }}
        />
        <Box mt={2}>
          {status === "loading" ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <l-cardio
                size="50"
                stroke="4"
                speed="2"
                color={colors.buff[500]}
              ></l-cardio>
            </div>
          ) : (
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={status === "loading"}
              fullWidth
              sx={{
                backgroundColor: "loading"
                  ? colors.sunset[700]
                  : colors.sunset[700],
                "&:hover": {
                  backgroundColor: "loading"
                    ? colors.sunset[500]
                    : colors.sunset[500],
                },
              }}
            >
              {t("login")}
            </Button>
          )}
        </Box>
        <Box display="flex" alignItems="center" justifyContent="center">
          {/* Language Menu */}
          <Typography
            variant="h4"
            mt={2}
            gutterBottom
            sx={{
              color: colors.sunset[100],
              mr: 2,
            }}
          >
            {t("changeLanguage")}
          </Typography>
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
      </Box>
    </Box>
  );
};

export default Login;
