import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "./useAuthContext.jsx";

export default function RequireAuth({ children }) {
    const { baker } = useAuthContext();
    const loc = useLocation();
    if (!baker) return <Navigate to="/login" replace state={{ from: loc }} />;
    return children;
}