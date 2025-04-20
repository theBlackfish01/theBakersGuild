import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLogout } from "./logout.jsx";

// Asset imports
import logo from "../assets/logo.png";

import { clientRoutes } from "../routes.js";

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


export default function CompanyNavbar({ currentPage }) {
  // navigation
  const navigate = useNavigate();
  const { logout } = useLogout()

  // state received
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem("user"))
  const userId = user.userId
  // console.log(userId)
  // console.log("UserId in Navbar: ",userId)

  // Logout handler
  const handleLogout = () => {
    logout();
  };

  // Helper function to determine button color based on the current page
  const getButtonColor = (pageName) => {
    return currentPage === pageName ? "primary" : "neutral";
  };

  const handleLogoClick = () => {
    // navigate to (/baker/dashboard)
    window.scrollTo(0, 0);
    navigate(clientRoutes.companyDashboard, { state: { userId: userId } });
  };

  const handleTabChange = (tab) => {
    if (tab === "dashboard") {
      // navigate to (/baker/dashboard)
      window.scrollTo(0, 0);
      navigate(clientRoutes.companyDashboard, { state: { userId: userId } });
    }
    if (tab === "postJob") {
      // navigate to (/postAJob)
      window.scrollTo(0, 0);
      navigate(clientRoutes.postAJob, { state: { userId: userId } });
    }
    if (tab === "settings") {
      // navigate to (/baker/settings)
      window.scrollTo(0, 0);
      navigate(clientRoutes.companySettings, { state: { userId: userId } });
      // console.log("Company Settings");
    }
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
          color={getButtonColor("postJob")}
          onClick={() => handleTabChange("postJob")}
        >
          Post a Recipe
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
