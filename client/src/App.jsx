import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

import { clientRoutes } from "./routes.js";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import BakerProfileSetup from "./pages/baker/BakerProfileSetup.jsx";
import NoviceProfileSetup from "./pages/novice/NoviceProfileSetup.jsx";
import BakerDashboard from "./pages/baker/BakerDashboard.jsx";
import NoviceDashboard from "./pages/novice/NoviceDashboard.jsx";
import PostARecipe from "./pages/baker/PostARecipe.jsx";
import SearchRecipes from "./pages/SearchRecipes.jsx";
import NoviceIndividualRecipe from "./pages/novice/NoviceIndividualRecipe.jsx";
import NoviceSettings from "./pages/novice/NoviceSettings.jsx";
import BakerSettings from "./pages/baker/BakerSettings.jsx";
import JobPostPage from "./pages/baker/BakerIndividualJob.jsx";
import BakerIndividualRecipeNew from "./pages/baker/BakerIndividualRecipeNew.jsx";
import { useAuthContext } from "./components/useAuthContext.jsx";

import { CssVarsProvider, extendTheme } from "@mui/joy/styles";

const newTheme = extendTheme({
  colorSchemes: {
    dark: {
      palette: {
        primary: {
          50: "#f9f5f0",
          100: "#f0e9df",
          200: "#e6d9c7",
          300: "#d9c4aa",
          400: "#c6ab8a",
          500: "#b39471",
          600: "#a27d5a",
          700: "#8c6848",
          800: "#735438",
          900: "#5d4328",
        },
      },
    },
    light: {
      palette: {
        primary: {
          50: "#ffffff",
          100: "#faf6f1",
          200: "#f5ece0",
          300: "#e9dbc6",
          400: "#ddc8a8",
          500: "#c9ad88",
          600: "#b69268",
          700: "#a07a4d",
          800: "#86633d",
          900: "#6a4e2f",
        },
      },
    },
  },
});

axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;

function App() {
  const { user, dispatch } = useAuthContext();

  useEffect(() => {
    if (!user) {
      axios.post("/user/guest")
          .then((res) => {
            dispatch({
              type: "LOGIN",
              payload: {
                userId: res.data.userId,
                userType: res.data.userType,
                token: res.data.user.token,
              },
            });
            localStorage.setItem("user", JSON.stringify({
              userId: res.data.userId,
              userType: res.data.userType,
              token: res.data.user.token,
            }));
          })
          .catch((err) => console.error("Guest login failed:", err));
    }
  }, [user]);


  return (
      <CssVarsProvider theme={newTheme}>
        <BrowserRouter>
          <Routes>
            {!user && (
                <>
                  <Route path={clientRoutes.signup} element={<Signup />} />
                  <Route path={clientRoutes.login} element={<Login />} />
                  <Route path="*" element={<Navigate to={clientRoutes.login} />} />
                </>
            )}

            {user && (
                <>
                  <Route path={clientRoutes.companyProfileSetup} element={<BakerProfileSetup />} />
                  <Route path={clientRoutes.devProfileSetup} element={<NoviceProfileSetup />} />
                  <Route path={clientRoutes.companyDashboard} element={<BakerDashboard />} />
                  <Route path={clientRoutes.devDashboard} element={<NoviceDashboard />} />
                  <Route path={clientRoutes.devIndividualJob} element={<NoviceIndividualRecipe />} />
                  <Route path={clientRoutes.companyIndividualJob} element={<BakerIndividualRecipeNew />} />
                  <Route path={clientRoutes.postAJob} element={<PostARecipe />} />
                  <Route path={clientRoutes.searchJobs} element={<SearchRecipes />} />
                  <Route path={clientRoutes.devSettings} element={<NoviceSettings />} />
                  <Route path={clientRoutes.companySettings} element={<BakerSettings />} />
                  <Route path={clientRoutes.signup} element={<Signup />} />
                  <Route path={clientRoutes.login} element={<Login />} />
                  {/* Default route: redirect based on userType */}
                  <Route
                      path="*"
                      element={
                        user.userType === "Company"
                            ? <Navigate to={clientRoutes.companyDashboard} />
                            : <Navigate to={clientRoutes.devDashboard} />
                      }
                  />
                </>
            )}
          </Routes>
        </BrowserRouter>
      </CssVarsProvider>
  );
}

export default App;