import { useContext } from "react";
import { AuthContext } from "./AuthContext.jsx";

export function useAuthContext() {
    return useContext(AuthContext);
}