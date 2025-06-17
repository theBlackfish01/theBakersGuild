// client/src/components/Navbar.jsx
import React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
    Box, Button, Dropdown, Menu, MenuButton, MenuItem, Stack, Avatar,
} from "@mui/joy";

import logo from "../assets/logo.png";
import { clientRoutes } from "../routes.js";
import { useAuthContext } from "./useAuthContext.jsx";
import useLogout from "../hooks/useLogout.js";

export default function Navbar() {
    const navigate  = useNavigate();
    const location  = useLocation();
    const { baker } = useAuthContext();

    // Call logout hook only when we actually need it
    const logout = baker ? useLogout() : null;

    // active-tab helper
    const active = (to) =>
        location.pathname.startsWith(typeof to === "function" ? to() : to)
            ? "primary"
            : "neutral";

    return (
        <Box
            component="header"
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: 4,
                py: 2,
                borderBottom: "1px solid rgba(0,0,0,.07)",
                backgroundColor: "#f9f5f0",
                position: "sticky",
                top: 0,
                zIndex: 20,
            }}
        >
            <img
                src={logo}
                alt="Bakers Guild"
                width={110}
                style={{ cursor: "pointer" }}
                onClick={() => navigate(clientRoutes.home)}
            />

            <Stack direction="row" spacing={2} alignItems="center">
                <Button
                    variant="plain"
                    color={active(clientRoutes.home)}
                    component={Link}
                    to={clientRoutes.home}
                >
                    Recipes
                </Button>

                {baker && (
                    <>
                        <Button
                            variant="plain"
                            color={active(clientRoutes.bakerDashboard)}
                            component={Link}
                            to={clientRoutes.bakerDashboard}
                        >
                            My Recipes
                        </Button>
                        <Button
                            variant="plain"
                            color={active(clientRoutes.postRecipe)}
                            component={Link}
                            to={clientRoutes.postRecipe}
                        >
                            Post
                        </Button>
                    </>
                )}

                {baker ? (
                    <Dropdown>
                        <MenuButton
                            sx={{
                                minWidth: 0,
                                p: 0,
                                lineHeight: 0,
                                "&:hover": { bgcolor: "transparent" },
                                border: "none",
                            }}
                        >
                            <Avatar color="primary">
                                {baker.name?.[0]?.toUpperCase() ?? "B"}
                            </Avatar>
                        </MenuButton>
                        <Menu placement="bottom-end">
                            <MenuItem onClick={logout}>Logout</MenuItem>
                        </Menu>
                    </Dropdown>
                ) : (
                    <>
                        <Button
                            size="sm"
                            variant="soft"
                            color="primary"
                            component={Link}
                            to={clientRoutes.login}
                        >
                            Login
                        </Button>
                        <Button
                            size="sm"
                            color="primary"
                            component={Link}
                            to={clientRoutes.signup}
                        >
                            Sign up
                        </Button>
                    </>
                )}
            </Stack>
        </Box>
    );
}
