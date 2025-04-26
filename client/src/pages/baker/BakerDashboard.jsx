import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

// UI Imports
import {
    Grid,
    Typography,
    Button,
    Stack,
    Alert,
    CircularProgress,
} from "@mui/joy";

// Custom Components Imports
import BakerNavbar from "../../components/BakerNavbar.jsx";
import BakerRecipeCard from "../../components/BakerRecipeCard.jsx";
import Footer from "../../components/Footer";

// Routes Import
import { apiRoutes, clientRoutes } from "../../routes.js";

export default function BakerDashboard() {
    // navigation
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"))
    const userId = user.userId
    // State to keep track of the active tab
    const [activeTab, setActiveTab] = useState("all");
    const [loading, setLoading] = useState(false);
    const [openPinnedJobs, setOpenPinnedJobs] = useState([]);
    const [openJobs, setOpenJobs] = useState([]);
    const [closedJobs, setClosedJobs] = useState([]);

    // Load jobs of this baker
    const loadMyJobs = async () => {
        setLoading(true);
        try {
            // API call
            const response = await axios.get(
                apiRoutes.company.getMyJobs(userId)
            );
            setOpenPinnedJobs(response.data.openPinnedJobs);
            setOpenJobs(response.data.openJobs);
            setClosedJobs(response.data.closedJobs);
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching jobs:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadMyJobs();
    }, []);

  useEffect(() => {
    loadMyJobs();
  }, []);
  const handleTabChange = (tab) => {
    setActiveTab(tab);
};

    return (
        <>
            <BakerNavbar currentPage="dashboard" />
            <Grid
                container
                sx={{
                    flexGrow: 1,
                    justifyContent: "center",
                    minHeight: "80vh",
                }}
            >
                <Grid
                    xs={12}
                    md={8}
                    sx={{
                        p: 4,
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    {/* Page Title */}
                    <Typography level="h1" sx={{ width: "100%" }} mb={4}>
                        My Recipes
                    </Typography>

                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={2}
                    >
                        {/* Tabs */}
                        <Stack
                            direction="row"
                            spacing={1}
                            p={1.2}
                            bgcolor={"#A47148"}
                            sx={{
                                width: "fit-content",
                                borderRadius: 8,
                                border: "1px solid #F2F4F7",
                            }}
                        >
                            {/* Tabs with active state handling */}
                            {/* All */}
                            <Button
                                variant={
                                    activeTab === "all" ? "outlined" : "plain"
                                }
                                color="neutral"
                                size="lg"
                                sx={{
                                    borderRadius: 6,
                                    bgcolor: activeTab === "all" ? "white" : "",
                                }}
                                onClick={() => handleTabChange("all")}
                            >
                                All
                            </Button>
                            {/* Bookmarked */}
                            <Button
                                variant={
                                    activeTab === "bookmarked"
                                        ? "outlined"
                                        : "plain"
                                }
                                size="lg"
                                color="neutral"
                                onClick={() => handleTabChange("bookmarked")}
                                sx={{
                                    borderRadius: 6,
                                    bgcolor:
                                        activeTab === "bookmarked"
                                            ? "white"
                                            : "",
                                }}
                            >
                                Bookmarked
                            </Button>
                            {/* Open*/}
                            <Button
                                variant={
                                    activeTab === "open" ? "outlined" : "plain"
                                }
                                size="lg"
                                color="neutral"
                                onClick={() => handleTabChange("open")}
                                sx={{
                                    borderRadius: 6,
                                    bgcolor:
                                        activeTab === "open" ? "white" : "",
                                }}
                            >
                                Open
                            </Button>
                            {/* Closed */}
                            <Button
                                variant={
                                    activeTab === "closed"
                                        ? "outlined"
                                        : "plain"
                                }
                                size="lg"
                                color="neutral"
                                onClick={() => handleTabChange("closed")}
                                sx={{
                                    borderRadius: 6,
                                    bgcolor:
                                        activeTab === "closed" ? "white" : "",
                                }}
                            >
                                Closed
                            </Button>
                        </Stack>
                        {/* Post a job button */}
                        <Button
                            size="lg"
                            onClick={() =>{window.scrollTo(0, 0);
                                navigate(clientRoutes.postAJob, {
                                    state: { userId: userId },
                                })}
                            }
                        >
                            Post a Recipe
                        </Button>
                    </Stack>
                    {/* Dasboard Content */}
                    {/* All jobs */}
                    {activeTab === "all" && (
                        <>
                            <Stack spacing={2} mt={4}>
                                {openJobs.map((myJob, index) => (
                                    <BakerRecipeCard
                                        key={index}
                                        userId={userId}
                                        myJob={myJob}
                                        setOpenPinnedJobs={setOpenPinnedJobs}
                                        setOpenJobs={setOpenJobs}
                                        setClosedJobs={setClosedJobs}
                                    />
                                ))}
                                {closedJobs.map((myJob, index) => (
                                    <BakerRecipeCard key={index} myJob={myJob} />
                                ))}
                            </Stack>
                        </>
                    )}
                    {/* Open Jobs */}
                    {activeTab === "open" && (
                        <>
                            <Stack spacing={2} mt={4}>
                                {openJobs.map((myJob, index) => (
                                    <BakerRecipeCard
                                        key={index}
                                        userId={userId}
                                        myJob={myJob}
                                        setOpenPinnedJobs={setOpenPinnedJobs}
                                        setOpenJobs={setOpenJobs}
                                        setClosedJobs={setClosedJobs}
                                    />
                                ))}
                            </Stack>
                        </>
                    )}
                    {/* Closed Jobs */}
                    {activeTab === "closed" && (
                        <Stack spacing={2} mt={4}>
                            {closedJobs.map((myJob, index) => (
                                <BakerRecipeCard key={index} myJob={myJob} />
                            ))}
                        </Stack>
                    )}
                    {/* Bookmarked Jobs */}
                    {activeTab === "bookmarked" && (
                        <Stack spacing={2} mt={4}>
                            {openPinnedJobs.map((myJob, index) => (
                                <BakerRecipeCard
                                    key={index}
                                    userId={userId}
                                    myJob={myJob}
                                    setOpenPinnedJobs={setOpenPinnedJobs}
                                    setOpenJobs={setOpenJobs}
                                    setClosedJobs={setClosedJobs}
                                />
                            ))}
                        </Stack>
                    )}
                    {/* No Bookmarked Jobs */}
                    {activeTab === "bookmarked" &&
                        openPinnedJobs.length === 0 && (
                            <Alert
                                size="lg"
                                sx={{
                                    background: "#F9F9FB",
                                    border: "1px solid #F2F4F7",
                                }}
                            >
                                You haven't bookmarked any recipes. Click the
                                bookmark icon on a recipe to bookmark it 📌
                            </Alert>
                        )}
                    {/* No Open Jobs */}
                    {activeTab === "open" && openJobs.length === 0 && (
                        <Alert
                            size="lg"
                            sx={{
                                background: "#F9F9FB",
                                border: "1px solid #F2F4F7",
                            }}
                        >
                            You don't have any recipes. Post a new recipe to get started! 🚀
                        </Alert>
                    )}
                    {/* No Closed Jobs */}
                    {activeTab === "closed" && closedJobs.length === 0 && (
                        <Alert
                            size="lg"
                            sx={{
                                background: "#F9F9FB",
                                border: "1px solid #F2F4F7",
                            }}
                        >
                            You don't have any closed recipes. Once you close a
                            recipe, it will appear here 📝
                        </Alert>
                    )}
                    {/* No All Jobs */}
                    {activeTab === "all" &&
                        openJobs.length === 0 &&
                        closedJobs.length === 0 &&
                        loading === false && (
                            <Alert
                                size="lg"
                                sx={{
                                    background: "#F9F9FB",
                                    border: "1px solid #F2F4F7",
                                }}
                            >
                                You don't have any recipes. Post a new recipe to get
                                started! 🚀
                            </Alert>
                        )}
                    {/* Loading */}
                    {loading && (
                        <Grid
                            container
                            justifyContent="center"
                            alignItems="center"
                        >
                            <CircularProgress variant="soft" />
                        </Grid>
                    )}
                </Grid>
            </Grid>
            <Footer />
        </>
    );
}
