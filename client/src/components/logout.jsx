import { useAuthContext } from "./useAuthContext";

export const useLogout = () => {
    const { dispatch } = useAuthContext();

    const logout = () => {
        // remove user from local storage to log user out
        localStorage.removeItem("user");
        localStorage.removeItem("token");

        // dispatch logout action
        dispatch({ type: "LOGOUT" });
    };

    return { logout };
};
