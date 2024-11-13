import React, { useContext, useEffect, useState } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import { useMode, ColorModeContext } from "./theme";
import { useMediaQuery } from "@mui/material";
import { tokens } from "./theme";
import { cardio } from "ldrs";
import { I18nextProvider, Trans, useTranslation } from "react-i18next";
import { getUserRoleFromToken } from "./getUserRoleFromToken";
import { setUser } from "./redux/userSlice";
import Navbar from "./components/navbar/Navbar";
import Topbar from "./components/topbar/Topbar";
import Home from "./Pages/Home";
import Family from "./Pages/Family";
import Coach from "./Pages/Coach";
import Athlete from "./Pages/Athlete";
import Login from "./Pages/Login";

const lngs = {
  en: { nativeName: "English" },
  de: { nativeName: "Arabic" },
};

function App() {
  const isDesktop = useMediaQuery("(min-width:1024px)");
  const [theme, colorMode] = useMode();
  const colors = tokens(theme.palette.mode);
  const [isLoading, setIsLoading] = useState(true);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.user.userInfo);
  const userRole =
    useSelector((state) => state.user.userRole) || getUserRoleFromToken();

  const savedToken = localStorage.getItem("token");

  useEffect(() => {
    const lng = navigate.language;
    i18n.changeLanguage(lng);
  }, []);

  const lng = navigator.language;

  useEffect(() => {
    const checkUser = async () => {
      if (savedToken) {
        const savedUser = JSON.parse(localStorage.getItem("userInfo"));
        if (savedUser) {
          dispatch(setUser(savedUser));
          navigate("/");
        }
      } else {
        navigate("/login");
      }
      setIsLoading(false);
    };

    checkUser();
  }, [navigate, dispatch, savedToken]);

  cardio.register();
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100dvh",
        }}
      >
        <l-cardio
          size="50"
          stroke="4"
          speed="2"
          color={colors.buff[500]}
        ></l-cardio>
      </div>
    );
  }

  // ProtectedRoute component to handle access control
  const ProtectedRoute = ({ children, requiredRole }) => {
    if (!savedToken) {
      return <Navigate to="/login" replace />;
    }
    if (userRole && requiredRole && userRole !== requiredRole) {
      return <Navigate to={`/${userRole.toLowerCase()}`} replace />;
    }
    return children;
  };

  return (
    <>
      <I18nextProvider i18n={i18n}>
        <ColorModeContext.Provider value={colorMode}>
          <ThemeProvider theme={theme}>
            {isDesktop ? <Topbar /> : <Navbar />}

            <main id="page-content" style={{ filter: "none" }}>
              <Routes>
                <Route exact path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/family"
                  element={
                    <ProtectedRoute requiredRole="Family">
                      <Family />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/coach"
                  element={
                    <ProtectedRoute requiredRole="Coach">
                      <Coach />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/athlete"
                  element={
                    <ProtectedRoute requiredRole="Athlete">
                      <Athlete />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
          </ThemeProvider>
        </ColorModeContext.Provider>
      </I18nextProvider>
    </>
  );
}

export default App;
