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
import { tokens } from "../theme";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/userSlice";
import { useMediaQuery } from "@mui/material";
import { useTranslation } from "react-i18next";
import TranslateOutlinedIcon from "@mui/icons-material/TranslateOutlined";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [languageAnchorEl, setLanguageAnchorEl] = useState(null);

  const { status, error } = useSelector((state) => state.user);
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

  if (status === "loading") {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        bgcolor={theme.palette.background.default}
      >
        <div>
          <l-cardio size="70" speed="1.75" color={colors.secondary.main} />
        </div>
      </Box>
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
          color:
            theme.palette.mode === "dark"
              ? colors.secondary.main
              : colors.secondary.dark,
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
            ".MuiOutlinedInput-root": {
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.secondary.main,
              },
            },
            ".MuiInputLabel-root.Mui-focused": {
              color: theme.palette.secondary.main,
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
            ".MuiOutlinedInput-root": {
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.secondary.main,
              },
            },
            ".MuiInputLabel-root.Mui-focused": {
              color: theme.palette.secondary.main,
            },
          }}
        />
        <Box mt={2}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={status === "loading"}
            sx={{
              backgroundColor: colors.secondary.dark,
              "&:hover": {
                backgroundColor: colors.secondary.dark,
              },
              color:
                theme.palette.mode === "dark"
                  ? colors.primary.dark
                  : colors.primary.light,
            }}
          >
            {t("login")}
          </Button>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="center" mt={2}>
          <Typography
            variant="body1"
            sx={{
              color:
                theme.palette.mode === "dark"
                  ? colors.secondary.main
                  : colors.secondary.dark,
              mr: 2,
            }}
          >
            {t("changeLanguage")}
          </Typography>
          <Tooltip title={t("changeLanguage")}>
            <IconButton onClick={handleLanguageMenu}>
              <TranslateOutlinedIcon
                color="primary"
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
            <MenuItem onClick={() => toggleLanguage("en")}>English</MenuItem>
            <MenuItem onClick={() => toggleLanguage("ar")}>العربية</MenuItem>
          </Menu>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
