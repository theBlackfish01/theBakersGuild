// client/src/components/Navbar.jsx  (safe stub)
import React from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Box, Button, Stack } from "@mui/joy";
import logo from "../assets/logo.png";
import { clientRoutes } from "../routes.js";
import { useAuthContext } from "./useAuthContext.jsx";

export default function Navbar() {
    const navigate  = useNavigate();
    const location  = useLocation();
    const { baker } = useAuthContext();

    const active = (to) =>
        location.pathname.startsWith(typeof to === "function" ? to() : to)
            ? "primary"
            : "neutral";

    return (
        <Box sx={{display:"flex",justifyContent:"space-between",alignItems:"center",px:4,py:2,borderBottom:"1px solid #eee",background:"#f9f5f0",position:"sticky",top:0,zIndex:20}}>
            <img src={logo} alt="guild" width={110} style={{cursor:"pointer"}} onClick={()=>navigate(clientRoutes.home)}/>
            <Stack direction="row" spacing={2} alignItems="center">
                <Button component={Link} to={clientRoutes.home}   variant="plain" color={active(clientRoutes.home)}>Recipes</Button>
                {baker && (
                    <>
                        <Button component={Link} to={clientRoutes.bakerDashboard} variant="plain" color={active(clientRoutes.bakerDashboard)}>My Recipes</Button>
                        <Button component={Link} to={clientRoutes.postRecipe}     variant="plain" color={active(clientRoutes.postRecipe)}>Post</Button>
                        <Button size="sm" color="neutral" onClick={()=>import("../hooks/useLogout.js").then(m=>m.default().then(()=>{}))}>Logout</Button>
                    </>
                )}
                {!baker && (
                    <>
                        <Button size="sm" component={Link} to={clientRoutes.login}>Login</Button>
                        <Button size="sm" component={Link} to={clientRoutes.signup}>Sign up</Button>
                    </>
                )}
            </Stack>
        </Box>
    );
}
