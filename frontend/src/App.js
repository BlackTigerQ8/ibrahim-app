import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  useNavigate,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import { useMode, ColorModeContext } from "./theme";
import { CssBaseline, useMediaQuery } from "@mui/material";
import { tokens } from "./theme";
import { I18nextProvider, useTranslation } from "react-i18next";
import { getUserRoleFromToken } from "./getUserRoleFromToken";
import { setUser } from "./redux/userSlice";
import Navbar from "./components/navbar/Navbar";
import Topbar from "./components/topbar/Topbar";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Schedules from "./Pages/Schedules";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { cardio } from "ldrs";
import Profile from "./Pages/Profile";
import Contact from "./Pages/Contact";
import About from "./Pages/About";

function App() {
  const isDesktop = useMediaQuery("(min-width:1024px)");
  const [theme, colorMode] = useMode();
  const colors = tokens(theme.palette.mode);
  const [isLoading, setIsLoading] = useState(true);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const currentUser = useSelector((state) => state.user.userInfo);
  const userRole =
    useSelector((state) => state.user.userRole) || getUserRoleFromToken();
  const savedToken = localStorage.getItem("token");

  useEffect(() => {
    i18n.changeLanguage(navigator.language);
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      // Allow access to "/" without checking the token
      if (location.pathname === "/" || location.pathname === "/login") {
        setIsLoading(false);
        return;
      }

      // For other routes, require login
      if (savedToken) {
        const savedUser = JSON.parse(localStorage.getItem("userInfo"));
        if (savedUser) {
          dispatch(setUser(savedUser));
        }
      } else {
        navigate("/login");
      }
      setIsLoading(false);
    };

    checkUser();
  }, [navigate, dispatch, savedToken, location.pathname]);

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
          size="70"
          speed="1.75"
          color={colors.secondary.main}
        ></l-cardio>
      </div>
    );
  }

  // ProtectedRoute component to handle access control
  const ProtectedRoute = ({ children, requiredRole }) => {
    if (!savedToken) {
      toast.warn(t("loginRequred"), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
      return <Navigate to="/login" replace />;
    }
    if (userRole && requiredRole && userRole !== requiredRole) {
      return <Navigate to={`/${userRole.toLowerCase()}`} replace />;
    }
    return children;
  };

  // PublicRoute component to allow access to public pages like "/home"
  const PublicRoute = ({ children }) => {
    return children;
  };

  return (
    <I18nextProvider i18n={i18n}>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {isDesktop ? <Topbar /> : <Navbar />}

          <main id="page-content" style={{ filter: "none" }}>
            <Routes>
              <Route
                path="/"
                element={
                  <PublicRoute>
                    <Home />
                  </PublicRoute>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route
                path="/schedules"
                element={
                  <ProtectedRoute>
                    <Schedules />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/about"
                element={
                  <ProtectedRoute>
                    <About />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/contact"
                element={
                  <ProtectedRoute>
                    <Contact />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/coach"
                element={
                  <ProtectedRoute requiredRole="Coach">
                    {/* <Coach /> */}
                  </ProtectedRoute>
                }
              />
              <Route
                path="/athlete"
                element={
                  <ProtectedRoute requiredRole="Athlete">
                    {/* <Athlete /> */}
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile/:id"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <ToastContainer />
        </ThemeProvider>
      </ColorModeContext.Provider>
    </I18nextProvider>
  );
}

export default App;
