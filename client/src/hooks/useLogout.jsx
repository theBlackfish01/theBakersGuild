import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../components/useAuthContext.jsx";

export function useLogout() {
    const { dispatch } = useAuthContext();
    const nav = useNavigate();
    return () => {
        localStorage.removeItem("baker");
        dispatch({ type:"LOGOUT" });
        nav("/login");
    };
}