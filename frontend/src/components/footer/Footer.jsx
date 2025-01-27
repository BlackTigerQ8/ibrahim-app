import React from "react";
import { Box, Typography, Container, Link, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: colors.primary.main,
        color: colors.neutral.light,
        py: 3,
        borderTop: `1px solid ${colors.primary.darkLight}`,
        mt: "auto", // This pushes the footer to the bottom
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              alignItems: "center",
            }}
          >
            <Link
              href="/"
              sx={{
                color: colors.neutral.light,
                textDecoration: "none",
                "&:hover": { color: colors.secondary.main },
              }}
            >
              {t("home")}
            </Link>
            <Link
              href="/about"
              sx={{
                color: colors.neutral.light,
                textDecoration: "none",
                "&:hover": { color: colors.secondary.main },
              }}
            >
              {t("about")}
            </Link>
            <Link
              href="/contact"
              sx={{
                color: colors.neutral.light,
                textDecoration: "none",
                "&:hover": { color: colors.secondary.main },
              }}
            >
              {t("contact")}
            </Link>
          </Box>
          <Typography
            variant="body2"
            sx={{
              textAlign: { xs: "center", sm: "right" },
            }}
          >
            © {currentYear}{" "}
            <Link
              href="https://aaalenezi.com"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: colors.neutral.light,
                textDecoration: "none",
                "&:hover": { color: colors.secondary.main },
              }}
            >
              {t("engineerName")}
            </Link>
            {" - "}
            {t("rights")}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
