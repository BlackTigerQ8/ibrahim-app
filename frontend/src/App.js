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
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { cardio } from "ldrs";
import Categories from "./Pages/Category/Categories";
import CategoryForm from "./Pages/Category/CategoryForm";
import Profile from "./Pages/User/Profile";
import Contact from "./Pages/Contact";
import About from "./Pages/About";
import Calendar from "./Pages/Calendar";
import UserForm from "./Pages/User/UserForm";
import Users from "./Pages/User/Users";
import Trainings from "./Pages/Training/Trainings";
import Training from "./Pages/Training/Training";
import TrainingForm from "./Pages/Training/TrainingForm";
import NotFound from "./Pages/NotFound";

function App() {
  const isDesktop = useMediaQuery("(min-width:1024px)");
  const [theme, colorMode] = useMode();
  const colors = tokens(theme.palette.mode);
  const [isLoading, setIsLoading] = useState(true);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  // const currentUser = useSelector((state) => state.user.userInfo);
  const userRole =
    useSelector((state) => state.user.userRole) || getUserRoleFromToken();
  const savedToken = localStorage.getItem("token");

  useEffect(() => {
    i18n.changeLanguage(navigator.language);
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      // Allow access to "/" without checking the token
      if (
        location.pathname === "/" ||
        location.pathname === "/about" ||
        location.pathname === "/login"
      ) {
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
  const ProtectedRoute = ({ children, requiredRole = [] }) => {
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

    // Allow Admin role regardless of requiredRoles
    if (userRole === "Admin") {
      return children;
    }

    if (requiredRole.length > 0 && !requiredRole.includes(userRole)) {
      toast.warn(t("notAuthorized"), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
      return <Navigate to={"/"} replace />;
    }
    return children;
  };

  // PublicRoute component to allow access to public pages like "/"
  const PublicRoute = ({ children }) => {
    return children;
  };

  const publicRoutes = [
    { path: "/", component: <Home /> },
    { path: "/about", component: <About /> },
  ];

  const protectedRoutes = [
    {
      path: "/category-form",
      component: <CategoryForm />,
      requiredRole: ["Admin"],
    },
    {
      path: "/categories",
      component: <Categories />,
      requiredRole: ["Coach", "Family"],
    },
    {
      path: "/training-form",
      component: <TrainingForm />,
      requiredRole: ["Coach", "Family"],
    },
    {
      path: "/categories/:categoryId/trainings",
      component: <Trainings />,
      requiredRole: ["Coach", "Family"],
    },
    {
      path: "/categories/:categoryId/trainings/:trainingId",
      component: <Training />,
      requiredRole: ["Family", "Coach", "Athlete"],
    },
    {
      path: "/calendar",
      component: <Calendar />,
      requiredRole: ["Family", "Coach", "Athlete"],
    },
    {
      path: "/user-form",
      component: <UserForm />,
      requiredRole: ["Admin"],
    },
    {
      path: "/users",
      component: <Users />,
      requiredRole: ["Admin"],
    },
    {
      path: "/contact",
      component: <Contact />,
      requiredRole: ["Family", "Coach", "Athlete"],
    },
    {
      path: "/profile/:id",
      component: <Profile />,
      requiredRole: ["Family", "Coach", "Athlete"],
    },
  ];

  return (
    <I18nextProvider i18n={i18n}>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {isDesktop ? <Topbar /> : <Navbar />}

          <main id="page-content" style={{ filter: "none" }}>
            <Routes>
              {publicRoutes.map((route, index) => (
                <Route
                  key={index}
                  path={route.path}
                  element={<PublicRoute>{route.component}</PublicRoute>}
                />
              ))}

              {protectedRoutes.map((route, index) => (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <ProtectedRoute requiredRole={route.requiredRole}>
                      {route.component}
                    </ProtectedRoute>
                  }
                />
              ))}
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <ToastContainer />
        </ThemeProvider>
      </ColorModeContext.Provider>
    </I18nextProvider>
  );
}

export default App;
