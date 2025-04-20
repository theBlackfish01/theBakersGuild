import { BrowserRouter, Routes, Route , Navigate } from "react-router-dom";
import axios from "axios";

import { clientRoutes } from "./routes.js";

import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import CompanyProfileSetup from "./pages/baker/CompanyProfileSetup.jsx";
import UserProfileSetup from "./pages/usr/UserProfileSetup.jsx";
import CompanyDashboard from "./pages/baker/CompanyDashboard.jsx";
import UserDashboard from "./pages/usr/UserDashboard.jsx";
import PostAJob from "./pages/baker/PostAJob.jsx";
import SearchJobs from "./pages/SearchJobs.jsx";
import DevIndividualJob from "./pages/usr/DevIndividualJob.jsx";
import UserSettings from "./pages/usr/UserSettings.jsx";
import CompanySettings from "./pages/baker/CompanySettings.jsx";
import JobPostPage from "./pages/baker/CompanyIndividualJob.jsx";
import CompanyIndividualJobNew from "./pages/baker/CompanyIndividualJobNew.jsx";
import { useAuthContext } from "./components/useAuthContext.jsx";

// Experimenting with themes
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


axios.defaults.baseURL = " http://localhost:8000";
axios.defaults.withCredentials = true;
function App() {
  const { user } = useAuthContext();
  return (
    <CssVarsProvider theme={newTheme}>
      <BrowserRouter>
      <Routes>
          {!user && (
            <>
              <Route path={clientRoutes.signup} element={<Signup />} />
              <Route path={clientRoutes.login} element={<Login />} />
              <Route path="*" element={<Navigate to={clientRoutes.login} />} /> {/* Add this line */}
              
            </>
          )}

            {user && (
              <>
                <Route path={clientRoutes.companyProfileSetup} element={<CompanyProfileSetup />} />
                <Route path={clientRoutes.devProfileSetup} element={<UserProfileSetup />} />
                <Route path={clientRoutes.companyDashboard} element={<CompanyDashboard />} />
                <Route path={clientRoutes.devDashboard} element={<UserDashboard />} />
                <Route path={clientRoutes.devIndividualJob} element={<DevIndividualJob />} />
                <Route path={clientRoutes.companyIndividualJob} element={<CompanyIndividualJobNew />} />
                <Route path={clientRoutes.postAJob} element={<PostAJob />} />
                <Route path={clientRoutes.searchJobs} element={<SearchJobs />} />
                <Route path={clientRoutes.devSettings} element={<UserSettings />} />
                <Route path={clientRoutes.companySettings} element={<CompanySettings />} />
                <Route path={clientRoutes.signup} element={<Signup />} />
                <Route path={clientRoutes.login} element={<Login />} />
              </>
            )}
        </Routes>
      </BrowserRouter>
    </CssVarsProvider>
  );
}

export default App;
