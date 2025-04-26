import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

// UI Imports
import { Grid, Typography, Button, Stack, Badge, Alert } from "@mui/joy";

// Custom Components Imports
import NoviceNavbar from "../../components/NoviceNavbar.jsx";
import NoviceRecipeCard from "../../components/NoviceRecipeCard.jsx";
import Footer from "../../components/Footer.jsx";

// Routes Import
import { apiRoutes, clientRoutes } from "../../routes.js";

export default function NoviceDashboard() {
    const [activeTab, setActiveTab] = useState("All");
    const [loading, setLoading] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [bookmarkedJobs, setBookmarkedJobs] = useState([]);
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [offeredJobs, setOfferedJobs] = useState([]);
    const [allJobs, setAllJobs] = useState([]);
    // navigation
    const navigate = useNavigate();

    // state received
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem("user"))
    const userId = user.userId
    // console.log("UserID now: ",userId)
    //Fetching All Jobs Together
    const fetchJobsData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(apiRoutes.job.getAll, {
                params: { userId },
            });
            const { allJobs, bookmarkedJobs, appliedJobs, offeredJobs} =
                response.data;
            setAllJobs(allJobs);
            setJobs(allJobs);
            setBookmarkedJobs(bookmarkedJobs);
            setAppliedJobs(appliedJobs);
            setOfferedJobs(offeredJobs);
        } catch (error) {
            console.error("Error fetching jobs:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchJobsData();
    }, []);

    const viewMoreJobs = async () => {
        // scroll to top
        window.scrollTo(0, 0);

        // navigate to (/novice/searchjobs)
        navigate(clientRoutes.searchJobs, { state: location.state });
    };

    // Handler to change the active tab
    const handleTabChange = async (tab) => {
        setActiveTab(tab);
        switch (tab) {
            case "All":
                setJobs(allJobs);
                break;
            case "Bookmarked":
                setJobs(bookmarkedJobs);
                break;
            case "Interested":
                setJobs(appliedJobs);
                break;
            case "Replies":
                setJobs(offeredJobs);
                break;
            default:
                break;
        }
    };

    // Effect to update the jobs displayed when bookmarkedJobs changes
    useEffect(() => {
        if (activeTab === "Bookmarked") {
            setJobs(bookmarkedJobs);
        }
    }, [bookmarkedJobs.length, activeTab]);

    return (
        <>
            <NoviceNavbar currentPage="dashboard" />
            <Grid
                container
                sx={{
                    flexGrow: 1,
                    justifyContent: "center",
                    minHeight: "80vh",
                }}
            >
                <Grid
                    item
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
                        Your Recipes Feed
                    </Typography>
                    {/* Tabs */}
                    <Stack
                        direction="row"
                        spacing={1}
                        p={1.2}
                        bgcolor={"#F9F9FB"}
                        sx={{
                            width: "fit-content",
                            borderRadius: 8,
                            border: "1px solid #F2F4F7",
                        }}
                    >
                        {/* Tabs with active state handling */}
                        {/* All */}
                        <Button
                            variant={activeTab === "All" ? "outlined" : "plain"}
                            color="neutral"
                            size="lg"
                            sx={{
                                borderRadius: 6,
                                bgcolor: activeTab === "All" ? "white" : "",
                            }}
                            onClick={() => handleTabChange("All")}
                        >
                            All
                        </Button>
                        {/* Bookmarked */}
                        <Button
                            disabled= {activeTab === "All" && allJobs.length === 0}
                            variant={
                                activeTab === "Bookmarked"
                                    ? "outlined"
                                    : "plain"
                            }
                            size="lg"
                            color="neutral"
                            onClick={() => handleTabChange("Bookmarked")}
                            sx={{
                                borderRadius: 6,
                                bgcolor:
                                    activeTab === "Bookmarked" ? "white" : "",
                            }}
                        >
                            Bookmarked
                        </Button>
                        {/* Applied */}
                        <Button
                            disabled= {activeTab === "All" && allJobs.length === 0}
                            variant={
                                activeTab === "Applied" ? "outlined" : "plain"
                            }
                            size="lg"
                            color="neutral"
                            onClick={() => handleTabChange("Applied")}
                            sx={{
                                borderRadius: 6,
                                bgcolor: activeTab === "Applied" ? "white" : "",
                            }}
                        >
                            Applied
                        </Button>
                        {/* Job offers */}
                        <Badge
                            color="primary"
                            badgeContent={offeredJobs.length}
                            size="sm"
                        >
                            <Button
                                disabled= {activeTab === "All" && allJobs.length === 0}
                                variant={
                                    activeTab === "Job Offers"
                                        ? "outlined"
                                        : "plain"
                                }
                                size="lg"
                                color="neutral"
                                onClick={() => handleTabChange("Job Offers")}
                                sx={{
                                    borderRadius: 6,
                                    bgcolor:
                                        activeTab === "Job Offers"
                                            ? "white"
                                            : "",
                                }}
                            >
                                Replies
                            </Button>
                        </Badge>
                    </Stack>
                    {/* Content based on active tab */}
                    {activeTab === "All" && (
                        <Stack spacing={2} mt={4}>
                            {jobs.map((job) => (
                                <NoviceRecipeCard
                                    key={job._id}
                                    job={job}
                                    userId={userId}
                                    setBookmarkedJobs={setBookmarkedJobs}
                                    bookmarkedJobs={bookmarkedJobs}
                                    appliedJobs={appliedJobs}
                                    offeredJobs={offeredJobs}
                                   
                                />
                            ))}
                        </Stack>
                    )}
                    {activeTab === "Bookmarked" && (
                        <Stack spacing={2} mt={4}>
                            {jobs.map((job) => (
                                <NoviceRecipeCard
                                    key={job._id}
                                    job={job}
                                    userId={userId}
                                    setBookmarkedJobs={setBookmarkedJobs}
                                    bookmarkedJobs={bookmarkedJobs}
                                    appliedJobs={appliedJobs}
                                    offeredJobs={offeredJobs}
                                  
                                />
                            ))}
                        </Stack>
                    )}
                    {activeTab === "Applied" && (
                        <Stack spacing={2} mt={4}>
                            {jobs.map((job) => (
                                <NoviceRecipeCard
                                    key={job._id}
                                    job={job}
                                    userId={userId}
                                    setBookmarkedJobs={setBookmarkedJobs}
                                    bookmarkedJobs={bookmarkedJobs}
                                    appliedJobs={appliedJobs}
                                    offeredJobs={offeredJobs}
                                    
                                />
                            ))}
                        </Stack>
                    )}

                    {activeTab === "Job Offers" && (
                        <Stack spacing={2} mt={4}>
                            {jobs.map((job) => (
                                <NoviceRecipeCard
                                    key={job._id}
                                    job={job}
                                    userId={userId}
                                    setBookmarkedJobs={setBookmarkedJobs}
                                    bookmarkedJobs={bookmarkedJobs}
                                    appliedJobs={appliedJobs}
                                    offeredJobs={offeredJobs}
                                  
                                />
                            ))}
                        </Stack>
                    )}

                    {/* NoJobs / Loading Jobs */}
                    {activeTab === "All" && allJobs.length === 0 && (
                        <Alert
                            size="lg"
                            sx={{
                                background: "#F9F9FB",
                                border: "1px solid #F2F4F7",
                            }}
                        >
                            {" "}
                            Hang tight! We're picking the best recipes for you! ✨{" "}
                        </Alert>
                    )}
                    {/* No Bookmarked Jobs */}
                    {activeTab === "Bookmarked" &&
                        bookmarkedJobs.length === 0 && (
                            <Alert
                                size="lg"
                                sx={{
                                    background: "#F9F9FB",
                                    border: "1px solid #F2F4F7",
                                }}
                            >
                                {" "}
                                You haven't bookmarked any recipes yet. Start
                                bookmarking to check later! 📌{" "}
                            </Alert>
                        )}
                    {/* No Applied Jobs */}
                    {activeTab === "Applied" && appliedJobs.length === 0 && (
                        <Alert
                            size="lg"
                            sx={{
                                background: "#F9F9FB",
                                border: "1px solid #F2F4F7",
                            }}
                        >
                            {" "}
                            You haven't applied to any recipes yet. Get started
                            today! 🚀{" "}
                        </Alert>
                    )}

                    {/*  View More Jobs */}
                    {activeTab === "All" && allJobs.length > 0 && (
                        <Button
                            variant="soft"
                            color="primary"
                            sx={{ borderRadius: 8, mt: 6 }}
                            loading={loading}
                            onClick={viewMoreJobs}
                        >
                            View More Recipes
                        </Button>
                    )}
                </Grid>
            </Grid>
            <Footer />
        </>
    );
}
