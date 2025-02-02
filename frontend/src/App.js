import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  useNavigate,
  Navigate,
  useLocation,
  useParams,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import { useMode, ColorModeContext } from "./theme";
import { Box, CssBaseline, useMediaQuery } from "@mui/material";
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
import EditCategory from "./Pages/Category/EditCategory";
import Cards from "./Pages/Category/Cards";
import ScheduleForm from "./Pages/Schedule/ScheduleForm";
import Schedules from "./Pages/Schedule/Schedules";
import EditSchedule from "./Pages/Schedule/EditSchedule";
import UserSchedule from "./Pages/Schedule/UserSchedule";
import EditTraining from "./Pages/Training/EditTraining";
import VerifyEmail from "./components/VerifyEmail";
import Footer from "./components/footer/Footer";

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
  const ProtectedRoute = ({ children, requiredRole = [], checkAccess }) => {
    const params = useParams();
    const currentUserInfo = useSelector((state) => state.user.userInfo);

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
      return (
        <Navigate
          to={location.state?.from || "/"}
          replace
          state={{ from: location.pathname }}
        />
      );
    }
    if (checkAccess && !checkAccess(params, currentUserInfo)) {
      toast.warn(t("notAuthorized"), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
      return (
        <Navigate
          to={location.state?.from || "/"}
          replace
          state={{ from: location.pathname }}
        />
      );
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
    { path: "/verify-email/:token", component: <VerifyEmail /> },
  ];

  const protectedRoutes = [
    {
      path: "/category-form",
      component: <CategoryForm />,
      requiredRole: ["Admin", "Coach"],
    },
    {
      path: "/categories",
      component: <Categories />,
      requiredRole: ["Coach", "Family"],
    },
    {
      path: "/categories/:id",
      component: <Cards />,
      requiredRole: ["Coach", "Family", "Athlete"],
    },
    {
      path: "/categories/edit/:categoryId",
      component: <EditCategory />,
      requiredRole: ["Admin", "Coach"],
    },
    {
      path: "/categories/:categoryId/trainings/training-form",
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
      path: "/categories/:categoryId/trainings/edit/:trainingId",
      component: <EditTraining />,
      requiredRole: ["Coach"],
    },
    {
      path: "/schedule-form",
      component: <ScheduleForm />,
      requiredRole: ["Coach"],
    },
    {
      path: "/schedules",
      component: <Schedules />,
      requiredRole: ["Coach"],
    },
    {
      path: "/schedule",
      component: <UserSchedule />,
      requiredRole: ["Family", "Coach", "Athlete"],
    },
    {
      path: "/schedules/edit/:scheduleId",
      component: <EditSchedule />,
      requiredRole: ["Coach"],
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
      requiredRole: ["Coach"],
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
      checkAccess: (params, currentUserInfo) => {
        const currentUserId = currentUserInfo?._id;
        const profileId = params.id;
        const userRole = getUserRoleFromToken();

        if (currentUserId === profileId) {
          return true;
        }

        if (userRole === "Coach" && currentUserId !== profileId) {
          return false;
        }

        if (userRole === "Admin") {
          return true;
        }

        return currentUserId === profileId;
      },
    },
  ];

  return (
    <I18nextProvider i18n={i18n}>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
            }}
          >
            {isDesktop ? <Topbar /> : <Navbar />}

            <main id="page-content" style={{ filter: "none", flex: 1 }}>
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
                      <ProtectedRoute
                        requiredRole={route.requiredRole}
                        checkAccess={route.checkAccess}
                      >
                        {route.component}
                      </ProtectedRoute>
                    }
                  />
                ))}
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            <ToastContainer />
          </Box>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </I18nextProvider>
  );
}

export default App;
