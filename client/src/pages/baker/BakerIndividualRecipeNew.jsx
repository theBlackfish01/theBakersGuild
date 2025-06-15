import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import React from "react";

// Route Imports
import { apiRoutes } from "../../routes";

// UI imports
import { Typography, Button, Stack, Chip, Grid, Snackbar } from "@mui/joy";

// Component Imports
import BakerNavbar from "../../components/BakerNavbar.jsx";
import RecipeApplications from "../../components/RecipeApplications.jsx";
import Footer from "../../components/Footer";

// Custom Assets Imports
import companySizeIcon from "../../assets/companySizeIcon.svg";
import timePostedIcon from "../../assets/timePostedIcon.svg";
import api from "../../lib/api.js";

// Formats compensation to USD
const formatCompenstation = (compensation) => {
    let USDollar = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumSignificantDigits: 3,
    });

    return `~ ${USDollar.format(compensation)}/yr`;
};

export default function BakerIndividualRecipeNew() {
    const [closeJob, setCloseJob] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [jobPost, setJobpost] = useState([]);
    const location = useLocation();
    const job = location.state;
    const jobId = job._id

    // console.log("Job: ",job)

    const datePosted = new Date(jobPost.datePosted);
    const currentDate = new Date();
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const daysAgo = Math.round(Math.abs((currentDate - datePosted) / oneDay));

    // console.log("JobId: ", jobId);

    const fetchApplicants = async () => {
        try {
            setLoading(true);
            const response = await api.get(apiRoutes.company.getApplicants, {
                params: { jobId },
            }); // Make a request to your backend API
            // console.log("Data that I am getting for the applicants  ", response);
            setJobpost(response.data.jobPost); // Update the state with the fetched applicants
        } catch (error) {
            console.error("Error fetching applicants:", error);
            setError("Error fetching applicants. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplicants();
    }, []);


    const handleCloseJob = async () => {
        setLoading(true);
        // simulate (TODO: replace with actual API call)
        setTimeout(() => {
            setLoading(false);
            setCloseJob(true);
            setSuccess(true);
            setOpenSnackbar(true);

            // TODO: navigate to baker dashboard
        }, 2000);
    };

    return (
        <>
            <BakerNavbar />
            <Stack spacing={0}>
                {/* Hero Section */}
                <Grid
                    container
                    xs={12}
                    flexGrow
                    justifyContent="center"
                    backgroundColor="#F8F9FA"
                >
                    <Grid
                        item
                        xs={12}
                        md={10.1}
                        p={6}
                        display="flex"
                        flexDirection="column"
                    >
                        <Stack spacing={"20px"}>
                            {/* Job Title */}
                            <Typography level="h1" sx={{ width: "100%" }}>
                                {jobPost.title}
                            </Typography>
                            {/* Key Facts */}
                            <Stack
                                direction="row"
                                spacing={2.5}
                                alignItems={"center"}
                            >
                                {/* No. of Applicants */}
                                <Typography
                                    level="title-lg"
                                    color="neutral"
                                    startDecorator={
                                        <img
                                            src={companySizeIcon}
                                            width={"24px"}
                                            alt="Company Size"
                                        ></img>
                                    }
                                >
                                    {jobPost.applicants ? jobPost.applicants.length : 0}
                                </Typography>
                                {/* Time Posted */}
                                <Typography
                                    level="title-lg"
                                    color="neutral"
                                    startDecorator={
                                        <img
                                            src={timePostedIcon}
                                            width={"24px"}
                                            alt="Company Size"
                                        ></img>
                                    }
                                >
                                    {daysAgo === 0
                                        ? "Today"
                                        : `${daysAgo} day${
                                              daysAgo > 1 ? "s" : ""
                                          } ago`}
                                </Typography>
                            </Stack>
                        </Stack>
                    </Grid>
                </Grid>
                {/* Job Details */}
                <Grid
                    container
                    xs={12}
                    sx={{
                        flexGrow: 1,
                        justifyContent: "center",
                    }}
                    p={6}
                >
                    {/* Details */}
                    <Grid item md={6.5}>
                        <Stack spacing={4}>
                            {/* Job Description */}
                            <Stack spacing={2}>
                                <Typography level="h2">Description</Typography>
                                <Typography level="body-lg" color="neutral">
                                    {jobPost.description && jobPost.description.split("\n").map((line, index) => (
                                        <React.Fragment key={index}>
                                            - {line}
                                            <br />
                                        </React.Fragment>
                                    ))}
                                </Typography>
                            </Stack>
                            {/* Requirements */}
                            <Stack spacing={2}>
                                <Typography level="h2">Requirements</Typography>
                                <Typography level="body-lg" color="neutral">
                                    {jobPost.requirements && jobPost.requirements.split("\n").map((line, index) => (
                                        <React.Fragment key={index}>
                                            - {line}
                                            <br />
                                        </React.Fragment>
                                    ))}
                                </Typography>
                            </Stack>
                        </Stack>
                    </Grid>
                    {/* Sidebar */}
                    <Grid item md={3.5} paddingLeft={6}>
                        {/* Close Job Card */}
                        <Grid>
                            <Stack
                                p={3}
                                borderRadius={10}
                                backgroundColor="#F9F9FB"
                                spacing={3}
                            >
                                <Stack spacing={1}>
                                    <Typography level="h3">
                                        Close Job
                                    </Typography>
                                    <Typography level="body-md" color="neutral">
                                        Not hiring anymore? Close this job so
                                        that our talent can know.
                                    </Typography>
                                </Stack>
                                {/* Close Job Button */}
                                <Button
                                    color="danger"
                                    variant="soft"
                                    disabled={closeJob}
                                    loading={loading}
                                    onClick={handleCloseJob}
                                >
                                    Close Job
                                </Button>
                            </Stack>
                        </Grid>
                        <Grid item mt={4}></Grid>
                        <Stack
                            p={3}
                            borderRadius={10}
                            border="1px solid #D0D5DD"
                            spacing={3}
                        >
                            <Stack spacing={2}>
                                {/* About The Job */}
                                <Typography level="h3" marginBottom={1}>
                                    About The Job
                                </Typography>
                                {/* Posted On */}
                                <Stack>
                                    <Typography
                                        level="title-md"
                                        color="neutral"
                                    >
                                        Posted On
                                    </Typography>
                                    <Typography level="title-md">
                                        {new Date(
                                                job.datePosted
                                            ).toLocaleDateString("en-GB", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            })}
                                    </Typography>
                                </Stack>
                                {/* Compensation */}
                                <Stack>
                                    <Typography
                                        level="title-md"
                                        color="neutral"
                                    >
                                        Compensation
                                    </Typography>
                                    <Typography level="title-md">
                                        {formatCompenstation(
                                                        job.compensation
                                                    )}
                                    </Typography>
                                </Stack>
                                {/* Job Logistics */}
                                <Stack spacing={0.8}>
                                    <Typography
                                        level="title-md"
                                        color="neutral"
                                    >
                                        Job Logistics
                                    </Typography>
                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        flexWrap="wrap"
                                        useFlexGap
                                    >
                                        {/* Job Type */}
                                        <Chip
                                            sx={{
                                                "--Chip-radius": "6px",
                                                borderColor: "#D0D5DD",
                                            }}
                                            variant="outlined"
                                        >
                                           {job.jobType}
                                        </Chip>
                                        {/* Job Environment */}
                                        <Chip
                                            sx={{
                                                "--Chip-radius": "6px",
                                                borderColor: "#D0D5DD",
                                            }}
                                            variant="outlined"
                                        >
                                             {job.environment}
                                        </Chip>
                                        {/* Experience Level */}
                                        <Chip
                                            sx={{
                                                "--Chip-radius": "6px",
                                                borderColor: "#D0D5DD",
                                            }}
                                            variant="outlined"
                                        >
                                            {job.experience}
                                        </Chip>
                                    </Stack>
                                </Stack>
                                {/* Skills */}
                                {job.preferredSkills.length > 0 && (
                                    <Stack spacing={0.8}>
                                        <Typography
                                            level="title-md"
                                            color="neutral"
                                        >
                                            Skills
                                        </Typography>
                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            flexWrap="wrap"
                                            useFlexGap
                                        >
                                            {/* Map chips according to no. of skills specified */}
                                            {job.preferredSkills.map(
                                                (skill, index) => (
                                                    <Chip
                                                        key={index}
                                                        sx={{
                                                            "--Chip-radius":
                                                                "6px",
                                                            borderColor:
                                                                "#D0D5DD",
                                                        }}
                                                        variant="outlined"
                                                    >
                                                        {skill}
                                                    </Chip>
                                                )
                                            )}
                                        </Stack>
                                    </Stack>
                                )}
                                {/* Technologies */}
                                {job.preferredTechnologies.length > 0 && (
                                    <Stack spacing={0.8}>
                                        <Typography
                                            level="title-md"
                                            color="neutral"
                                        >
                                            Technologies
                                        </Typography>
                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            flexWrap="wrap"
                                            useFlexGap
                                        >
                                            {/* Map chips according to no. of technologies specified */}
                                            {job.preferredTechnologies.map(
                                                (technology, index) => (
                                                    <Chip
                                                        key={index}
                                                        sx={{
                                                            "--Chip-radius":
                                                                "6px",
                                                            borderColor:
                                                                "#D0D5DD",
                                                        }}
                                                        variant="outlined"
                                                    >
                                                        {technology}
                                                    </Chip>
                                                )
                                            )}
                                        </Stack>
                                    </Stack>
                                )}
                                {/* Programming Languages */}
                                {job.preferredLanguages.length > 0 && (
                                    <Stack spacing={0.8}>
                                        <Typography
                                            level="title-md"
                                            color="neutral"
                                        >
                                            Programming Languages
                                        </Typography>
                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            flexWrap="wrap"
                                            useFlexGap
                                        >
                                            {/* Map chips according to no. of programming langs specified */}
                                            {job.preferredLanguages.map(
                                                (language, index) => (
                                                    <Chip
                                                        key={index}
                                                        sx={{
                                                            "--Chip-radius":
                                                                "6px",
                                                            borderColor:
                                                                "#D0D5DD",
                                                        }}
                                                        variant="outlined"
                                                    >
                                                        {language}
                                                    </Chip>
                                                )
                                            )}
                                        </Stack>
                                    </Stack>
                                )}
                            </Stack>
                        </Stack>
                    </Grid>
                </Grid>
            </Stack>
            {/* Snackbar */}
            <Snackbar
                variant="soft"
                color={success ? "success" : "danger"}
                open={openSnackbar}
                size="lg"
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
                endDecorator={
                    <Button
                        onClick={() => setOpenSnackbar(false)}
                        size="sm"
                        variant="soft"
                        color={success ? "success" : "danger"}
                    >
                        Dismiss
                    </Button>
                }
            >
                {success ? "Job closed successfully." : error}
            </Snackbar>
            {/* Job Applications Management */}
            <RecipeApplications job={job} />
            <Footer />
        </>
    );
}
