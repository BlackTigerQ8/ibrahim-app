import { createContext, useMemo, useState } from "react";
import { createTheme } from "@mui/material/styles";

// Color design tokens
export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        primary: {
          main: "#111317",
          light: "#1f2125",
          extraLight: "#35373b",
        },
        secondary: {
          main: "#f9ac54",
          dark: "#d79447",
          hover: "#d79447",
        },
        neutral: {
          light: "#d1d5db",
          white: "#ffffff",
        },
        background: {
          default: "#111317",
        },
      }
    : {
        primary: {
          main: "#ffffff",
          light: "#f1f1f1",
          darkLight: "#4e4e4e",
          extraLight: "#e9e9e9",
        },
        secondary: {
          main: "#111317",
          dark: "#1f2125",
          hover: "#d79447",
        },
        neutral: {
          light: "#111317",
          white: "#ffffff",
        },
        background: {
          default: "#f1f1f1",
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
  const [mode, setMode] = useState("dark");

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
