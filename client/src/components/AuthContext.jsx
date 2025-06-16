import { createContext, useReducer, useEffect, useState } from "react";

export const AuthContext = createContext();

function reducer(state, action) {
    switch (action.type) {
        case "LOGIN":
            return { baker: action.payload.baker };
        case "LOGOUT":
            return { baker: null };
        default:
            return state;
    }
}

export function AuthContextProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, { baker: null });
    const [boot, setBoot] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await api.get(apiRoutes.auth.me); // <-- calls /auth/me
                dispatch({ type: "LOGIN", payload: { baker: data.baker } });
                localStorage.setItem("baker", JSON.stringify(data.baker)); // optional cache
            } catch {
                /* not logged in or token expired – ignore silently */
            } finally {
                setBoot(false);            // render children when check completes
            }
        })();
    }, []);


    if (boot) return null; // or a spinner
    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
}
