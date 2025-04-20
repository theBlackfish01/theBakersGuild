import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useLogout } from "./logout.jsx";

// Asset imports
import logo from "../assets/logo.png";

// UI imports
import {
    Box,
    Button,
    Dropdown,
    Menu,
    MenuButton,
    MenuItem,
    Stack,
    Avatar,
} from "@mui/joy";

import { clientRoutes } from "../routes.js";

export default function DevNavbar({ currentPage }) {
    // navigation
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useLogout()

    // Logout handler (redirect to login page)
    const handleLogout = () => {
       logout();
    };

    // Helper function to determine button color based on the current page
    const getButtonColor = (pageName) => {
        return currentPage === pageName ? "primary" : "neutral";
    };

    // handleTabChange function
    const handleTabChange = (tab) => {
        if (tab === "dashboard") {
            // navigate to (/usr)
            window.scrollTo(0, 0);
            navigate(clientRoutes.devDashboard, { state: location.state });
        }
        if (tab === "search") {
            // navigate to (/usr/searchjobs)
            window.scrollTo(0, 0);
            navigate(clientRoutes.searchJobs, { state: location.state });
        }
        if (tab === "settings") {
            // navigate to (/usr/settings)
            window.scrollTo(0, 0);
            navigate(clientRoutes.devSettings, { state: location.state });
        }
    };

    const handleLogoClick = () => {
        // navigate to (/usr)
        window.scrollTo(0, 0);
        navigate(clientRoutes.devDashboard, { state: location.state });
    };

    return (
        <Box
            component="header"
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 32px", // Adjust the padding as needed
                // boxShadow: "0 2px 4px rgba(0,0,0,0.1)", // Optional: adds shadow to the Navbar
                borderBottom: "1px solid rgba(0,0,0,0.1)", // Optional: adds a border to the Navbar
                backgroundColor: "#f9f5f0", // Adjust the background color as needed
            }}
        >
            <img
                src={logo}
                alt="logo"
                width="100"
                onClick={handleLogoClick}
                style={{ cursor: "pointer" }}
            />
            <Stack direction="row" spacing={2} alignItems="center">
                <Button
                    variant="plain"
                    color={getButtonColor("dashboard")}
                    onClick={() => handleTabChange("dashboard")}
                >
                    Dashboard
                </Button>
                <Button
                    variant="plain"
                    color={getButtonColor("search")}
                    onClick={() => handleTabChange("search")}
                >
                    Search
                </Button>
                <Button
                    variant="plain"
                    color={getButtonColor("settings")}
                    onClick={() => handleTabChange("settings")}
                >
                    Settings
                </Button>
                {/* Assuming 'OR' is a button or a user's initials/avatar */}
                <Dropdown>
                    {/* Remove styling from MenuButton */}
                    <MenuButton
                        sx={{
                            minWidth: 0, // Remove button padding
                            padding: 0, // Remove button padding
                            lineHeight: 0, // Remove button extra height
                            "&:hover": { bgcolor: "transparent" }, // Remove hover effect
                            border: "none", // Remove button border
                        }}
                    >
                        <Avatar color="primary">OR</Avatar>
                    </MenuButton>
                    <Menu>
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                </Dropdown>
            </Stack>
        </Box>
    );
}
