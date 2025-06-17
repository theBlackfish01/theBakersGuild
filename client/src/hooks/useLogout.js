// client/src/hooks/useLogout.js
import api from "../lib/api.js";
import { apiRoutes } from "../routes.js";
import { useAuthContext } from "../components/useAuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function useLogout() {
    const { dispatch } = useAuthContext();
    const navigate = useNavigate();

    return async () => {
        try {
            await api.post(apiRoutes.auth.logout);
        } finally {
            localStorage.removeItem("baker");
            dispatch({ type: "LOGOUT" });
            navigate("/");
        }
    };
}