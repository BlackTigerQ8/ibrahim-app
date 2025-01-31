import { createContext, useEffect, useMemo, useState } from "react";
import { createTheme } from "@mui/material/styles";

// Color design tokens
export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        primary: {
          main: "#111317", // dark background for primary
          light: "#1f2125", // slightly lighter dark for contrast
          darkLight: "#35373b", // a medium dark gray for accents
          extraLight: "#35373b", // a softer dark for hover states
          default: "#1f2125",
          tableBackground: "#35373b",
        },
        secondary: {
          main: "#f9ac54", // gold-yellow primary secondary color
          dark: "#d79447", // darker shade of gold for hover states
          hover: "#d79447", // hover state for secondary elements
          light: "#ffc988", // a soft yellow for lighter backgrounds or highlights
        },
        neutral: {
          light: "#d1d5db", // light neutral color for text
          white: "#ffffff", // white for text and backgrounds
          text: "#ffffff",
        },
        background: {
          default: "#111317", // dark background for the entire page
        },
        status: {
          success: "#4caf50", // green for completed tasks
          error: "#f44336", // red for error or cancelled states
          default: "#d3d3d3", // default state, dark primary color
        },
      }
    : {
        primary: {
          main: "#ffffff", // white for light mode background
          light: "#f1f1f1", // very light gray for subtle background elements
          darkLight: "#4e4e4e", // a softer dark gray for accents
          extraLight: "#d3d3d3", // light background color for hover or borders
          default: "#a9a9a9",
          tableBackground: "#f1f1f1",
        },
        secondary: {
          main: "#111317", // dark gray for secondary elements
          dark: "#1f2125", // slightly darker gray for hover states
          hover: "#d79447", // gold-yellow hover effect for secondary
          light: "#ffc988", // a pale yellow to keep things bright
        },
        neutral: {
          light: "#111317", // very dark neutral for light mode text
          white: "#000000", // white for text and backgrounds
          text: "#000000",
        },
        background: {
          default: "#f1f1f1", // light background for the entire page
        },
        status: {
          success: "#4caf50", // green for completed tasks
          error: "#f44336", // red for error or cancelled states
          default: "#bebebe", // default state, light background color
        },
      }),
});

// MUI theme settings
export const themeSettings = (mode) => {
  const colors = tokens(mode);
  return {
    palette: {
      mode: mode,
      primary: {
        main: colors.primary.main,
        light: colors.primary.light,
        extraLight: colors.primary.extraLight,
      },
      secondary: {
        main: colors.secondary.main,
        dark: colors.secondary.dark,
      },
      neutral: {
        light: colors.neutral.light,
        white: colors.neutral.white,
      },
      background: {
        default: colors.background.default,
      },
    },
    typography: {
      fontFamily: ["Source Sans 3", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Source Sans 3", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Source Sans 3", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Source Sans 3", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Source Sans 3", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Source Sans 3", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Source Sans 3", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};

// context for color mode
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  const prefersDarkMode = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  const [mode, setMode] = useState(prefersDarkMode ? "dark" : "light");

  // Event listener for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      setMode(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === "dark" ? "light" : "dark")),
    }),
    []
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return [theme, colorMode];
};
