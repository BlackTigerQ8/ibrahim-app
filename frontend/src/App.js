import React, { useContext } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { useMode, ColorModeContext } from "./theme";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Header from "./components/header/Header";
import Navbar from "./components/navbar/Navbar";
import Topbar from "./components/topbar/Topbar";
import Home from "./Pages/Home";
import { useMediaQuery } from "@mui/material";

function App() {
  const isDesktop = useMediaQuery("(min-width:1024px)");
  const [theme, colorMode] = useMode();

  return (
    <>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          {isDesktop ? <Topbar /> : <Navbar />}
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/about" element={<Header />} />
          </Routes>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </>
  );
}

export default App;
