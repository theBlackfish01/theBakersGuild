import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CssVarsProvider, extendTheme } from "@mui/joy/styles";
import { useAuthContext } from "./components/useAuthContext.jsx";

import Signup from "./pages/Signup.jsx";
import Login  from "./pages/Login.jsx";
import SearchRecipes from "./pages/SearchRecipes.jsx";
import PostRecipe     from "./pages/baker/PostRecipe.jsx";
import BakerDashboard from "./pages/baker/BakerDashboard.jsx";
import RequireAuth    from "./components/RequireAuth.jsx";
import { clientRoutes } from "./routes.js";
import EditRecipe from "./pages/baker/EditRecipe.jsx";
import RecipeDetail from "./pages/RecipeDetail.jsx";
import Navbar from "./components/Navbar.jsx";


const theme = extendTheme({
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


export default function App() {
  const { baker } = useAuthContext();

  return (
      <CssVarsProvider theme={theme} defaultMode="light">
        <BrowserRouter>
          <Routes>
            <Navbar />
            {/* Public */}
            <Route path={clientRoutes.home} element={<SearchRecipes />} />
            <Route path={clientRoutes.signup} element={baker ? <Navigate to={clientRoutes.home}/> : <Signup />} />
            <Route path={clientRoutes.login}  element={baker ? <Navigate to={clientRoutes.home}/> : <Login />} />

            {/* Baker‑only */}
            <Route path={clientRoutes.postRecipe} element={<RequireAuth><PostRecipe/></RequireAuth>} />
            <Route path={clientRoutes.bakerDashboard} element={<RequireAuth><BakerDashboard/></RequireAuth>} />
            <Route path="/recipe/:id" element={<RecipeDetail/>} />
            <Route path="/baker/edit/:id" element={<RequireAuth><EditRecipe/></RequireAuth>} />
            {/* Fallback */}
            <Route path="*" element={<Navigate to={clientRoutes.home} replace />} />
          </Routes>
        </BrowserRouter>
      </CssVarsProvider>
  );
}
