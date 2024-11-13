import { createContext, useMemo, useState } from "react";
import { createTheme } from "@mui/material/styles";

// Color design tokens
export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        black: {
          100: "#d4d4d4",
          200: "#a9a9a9",
          300: "#7d7d7d",
          400: "#525252",
          500: "#272727",
          600: "#1f1f1f",
          700: "#171717",
          800: "#101010",
          900: "#080808",
        },
        buff: {
          100: "#f6eee5",
          200: "#eeddcb",
          300: "#e5ccb1",
          400: "#ddbb97",
          500: "#d4aa7d",
          600: "#aa8864",
          700: "#7f664b",
          800: "#554432",
          900: "#2a2219",
        },
        sunset: {
          100: "#fcf6ec",
          200: "#f9ecd8",
          300: "#f5e3c5",
          400: "#f2d9b1",
          500: "#efd09e",
          600: "#bfa67e",
          700: "#8f7d5f",
          800: "#60533f",
          900: "#302a20",
        },
        beige: {
          100: "#f6f7f0",
          200: "#edefe1",
          300: "#e4e8d1",
          400: "#dbe0c2",
          500: "#d2d8b3",
          600: "#a8ad8f",
          700: "#7e826b",
          800: "#545648",
          900: "#2a2b24",
        },
        cadetGray: {
          100: "#e9eef1",
          200: "#d3dde2",
          300: "#bccbd4",
          400: "#a6bac5",
          500: "#90a9b7",
          600: "#738792",
          700: "#56656e",
          800: "#3a4449",
          900: "#1d2225",
        },
      }
    : {
        black: {
          100: "#080808",
          200: "#101010",
          300: "#171717",
          400: "#1f1f1f",
          500: "#272727",
          600: "#525252",
          700: "#7d7d7d",
          800: "#a9a9a9",
          900: "#d4d4d4",
        },
        buff: {
          100: "#2a2219",
          200: "#554432",
          300: "#7f664b",
          400: "#aa8864",
          500: "#d4aa7d",
          600: "#ddbb97",
          700: "#e5ccb1",
          800: "#eeddcb",
          900: "#f6eee5",
        },
        sunset: {
          100: "#302a20",
          200: "#60533f",
          300: "#8f7d5f",
          400: "#bfa67e",
          500: "#efd09e",
          600: "#f2d9b1",
          700: "#f5e3c5",
          800: "#f9ecd8",
          900: "#fcf6ec",
        },
        beige: {
          100: "#2a2b24",
          200: "#545648",
          300: "#7e826b",
          400: "#a8ad8f",
          500: "#d2d8b3",
          600: "#dbe0c2",
          700: "#e4e8d1",
          800: "#edefe1",
          900: "#f6f7f0",
        },
        cadetGray: {
          100: "#1d2225",
          200: "#3a4449",
          300: "#56656e",
          400: "#738792",
          500: "#90a9b7",
          600: "#a6bac5",
          700: "#bccbd4",
          800: "#d3dde2",
          900: "#e9eef1",
        },
      }),
});

// mui theme settings
export const themeSettings = (mode) => {
  const colors = tokens(mode);
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            buff: {
              main: colors.buff[500],
            },
            secondary: {
              main: colors.sunset[500],
            },
            neutral: {
              dark: colors.black[700],
              main: colors.black[500],
              light: colors.black[100],
            },
            background: {
              default: colors.buff[500],
            },
          }
        : {
            buff: {
              main: colors.buff[100],
            },
            secondary: {
              main: colors.sunset[500],
            },
            neutral: {
              dark: colors.black[700],
              main: colors.black[500],
              light: colors.black[100],
            },
            background: {
              default: "#fcfcfc",
            },
          }),
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
