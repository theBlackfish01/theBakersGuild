import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

// Route Imports
import { apiRoutes, clientRoutes } from "../routes";

// Custom Components
import ApplicantCardNew from "./ApplicantCardNew";

// UI Imports
import {
    Typography,
    Button,
    Stack,
    Chip,
    IconButton,
    Grid,
    Card,
    CardContent,
    Link,
    Avatar,
    Alert,
} from "@mui/joy";
import api from "../lib/api.js";

export default function RecipeApplications({ job }) {
    const [activeTab, setActiveTab] = useState("All");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [applicants, setApplicants] = useState({
        all: [],
        rejected: [],
        shortlisted: [],
        offers: [],
        hired: [],
    });

    // console.log("Job applications: ",job._id)

    useEffect(() => {
        const fetchApplicants = async () => {
            // console.log("IN Fetch Applicants Function")
            try {
                setLoading(true);
                const response = await api.get(apiRoutes.job.getJobApplicants, {
                    params: { jobId: job._id },
                });
                setApplicants({
                    all: response.data.allApplicants,
                    rejected: response.data.rejected,
                    shortlisted: response.data.shortlisted,
                    offers: response.data.offered,
                    hired: response.data.accepted,
                });

                // console.log("Applicants in  jb applicantion: ",response.data)

                // setApplicants(response.data.applications);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching applicants:", error);
                setError("Error fetching applicants. Please try again.");
                setLoading(false);
            }
        };

        fetchApplicants();
    }, [job._id]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const getApplicantsByTab = () => {
        switch (activeTab) {
            case "All":
                return applicants.all;
            case "Rejected":
                return applicants.rejected;
            case "Shortlisted":
                return applicants.shortlisted;
            case "Offers":
                return applicants.offers;
            case "Hired":
                return applicants.hired;
            default:
                return [];
        }
    };

    useEffect(() => {
       //
    }, [activeTab]);
    return (
        <Grid
            container
            flexGrow
            justifyContent={"center"}
            backgroundColor={"#d9c4aa"}
        >
            <Grid item md={10} p={6} display={"flex"} flexDirection={"column"}>
                <Stack spacing={4}>
                    <Stack spacing={3}>
                        <Typography level="h1">Applications</Typography>
                        {/* Tabs */}
                        <Stack
                            direction="row"
                            spacing={1}
                            p={1.2}
                            bgcolor={"#d9c4aa"}
                            sx={{
                                width: "fit-content",
                                borderRadius: 8,
                                border: "1px solid #F2F4F7",
                            }}
                        >
                            {/* Tabs with active state handling */}
                            {["All", "Rejected", "Shortlisted", "Offers", "Hired"].map(tab => (
                                <Button
                                    key={tab}
                                    variant={activeTab === tab ? "outlined" : "plain"}
                                    size="lg"
                                    color="neutral"
                                    onClick={() => handleTabChange(tab)}
                                    sx={{
                                        borderRadius: 6,
                                        bgcolor: activeTab === tab ? "white" : "",
                                    }}
                                >
                                    {tab}
                                </Button>
                            ))}
                        </Stack>
                        {/* Render applicants based on active tab */}
                        <Stack spacing={2}>
                            {getApplicantsByTab().map(applicant => (
                                <ApplicantCardNew key={applicant._id} applicant={applicant} jobId = {job._id} />
                            ))}
                        </Stack>
                    </Stack>
                </Stack>
            </Grid>
        </Grid>
    );
}
