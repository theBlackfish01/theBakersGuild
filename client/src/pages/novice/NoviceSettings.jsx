import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

// Routes Import
import { apiRoutes, clientRoutes } from "../../routes.js";

// Components Import
import NoviceNavbar from "../../components/NoviceNavbar.jsx";
import NoviceProfileSettings from "../../components/NoviceProfileSettings.jsx";
import ChangePassword from "../../components/ChangePassword.jsx";
import DeleteAccount from "../../components/DeleteAccount.jsx";
import Footer from "../../components/Footer.jsx";

// UI Imports
import { Typography, Button, Stack, Grid } from "@mui/joy";
import {useAuthContext} from "../../components/useAuthContext.jsx";

export default function NoviceSettings() {
    const [activeTab, setActiveTab] = useState("Profile");

    const location = useLocation();
    const { user } = useAuthContext();
    const userId = location.state?.userId || user?.userId || "guest-placeholder-id";

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <>
            <NoviceNavbar currentPage={"settings"} />
            <Grid
                container
                xs={12}
                sx={{
                    flexGrow: 1,
                    justifyContent: "center",
                }}
                p={4}
                minHeight="82vh"
            >
                {/* Sidebar */}
                <Grid item md={3} paddingRight={12}>
                    <Stack
                        spacing={2}
                        p={2}
                        bgcolor={"#F9F9FB"}
                        sx={{
                            borderRadius: 8,
                            border: "1px solid #F2F4F7",
                        }}
                    >
                        <Typography level="h3">Settings</Typography>
                        <Stack spacing={1}>
                            {/* Profile */}
                            <Button
                                variant={
                                    activeTab === "Profile"
                                        ? "outlined"
                                        : "plain"
                                }
                                color="neutral"
                                size="lg"
                                sx={{
                                    borderRadius: 6,
                                    bgcolor:
                                        activeTab === "Profile" ? "white" : "",
                                    justifyContent: "flex-start",
                                    paddingLeft: 2,
                                    paddingRight: 2,
                                }}
                                onClick={() => handleTabChange("Profile")}
                            >
                                Profile
                            </Button>
                            {/* Change Password */}
                            <Button
                                variant={
                                    activeTab === "Change Password"
                                        ? "outlined"
                                        : "plain"
                                }
                                color="neutral"
                                size="lg"
                                sx={{
                                    borderRadius: 6,
                                    bgcolor:
                                        activeTab === "Change Password"
                                            ? "white"
                                            : "",
                                    justifyContent: "flex-start",
                                    paddingLeft: 2,
                                    paddingRight: 2,
                                }}
                                onClick={() =>
                                    handleTabChange("Change Password")
                                }
                            >
                                Change Password
                            </Button>
                            {/* Delete Account */}
                            <Button
                                variant={
                                    activeTab === "Delete Account"
                                        ? "outlined"
                                        : "plain"
                                }
                                color="neutral"
                                size="lg"
                                sx={{
                                    borderRadius: 6,
                                    bgcolor:
                                        activeTab === "Delete Account"
                                            ? "white"
                                            : "",
                                    justifyContent: "flex-start",
                                    paddingLeft: 2,
                                    paddingRight: 2,
                                }}
                                onClick={() =>
                                    handleTabChange("Delete Account")
                                }
                            >
                                Delete Account
                            </Button>
                        </Stack>
                    </Stack>
                </Grid>
                {/* Main Content */}
                <Grid item md={6}>
                    {activeTab === "Profile" && <NoviceProfileSettings userId = {userId}/>}
                    {activeTab === "Change Password" && <ChangePassword userId = {userId}/>}
                    {activeTab === "Delete Account" && <DeleteAccount userId = {userId}/>}
                </Grid>
            </Grid>
            <Footer />
        </>
    );
}
