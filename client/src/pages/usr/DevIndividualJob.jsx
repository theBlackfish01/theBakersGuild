import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import React from "react";

// Routes
import { apiRoutes } from "../../routes.js";

// Custom Components
import DevNavbar from "../../components/DevNavbar.jsx";
import DevApplyJob from "../../components/DevApplyJob.jsx";
import Footer from "../../components/Footer.jsx";
import DevJobRecs from "../../components/DevJobRecs.jsx";

// Custom Assets
import companySizeIcon from "../../assets/companySizeIcon.svg";
import timePostedIcon from "../../assets/timePostedIcon.svg";
import bookmarkActiveIcon from "../../assets/bookmarkActiveIcon.svg";
import bookmarkInactiveIcon from "../../assets/bookmarkInactiveIcon.svg";
import visitWebsiteIcon from "../../assets/visitWebsiteIcon.svg";
import appliedIcon from "../../assets/appliedIcon.svg";
import offerPendingIcon from "../../assets/offerPendingIcon.svg";
import offerAcceptedIcon from "../../assets/offerAcceptedIcon.svg";
import offerRejectedIcon from "../../assets/offerRejectedIcon.svg";

// UI Imports
import {
    Typography,
    Button,
    Stack,
    Avatar,
    Chip,
    IconButton,
    Grid,
} from "@mui/joy";

export default function DevIndividualJob() {

    // Handling The Data Received
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem("user"))
    const userId = user.userId
    const job = location.state.job;
    console.log("Location State: ",location.state)
    
    // Job Application Status
    const [applied, setApplied] = useState(location.state.applied || false);
    const [pendingOffer, setPendingOffer] = useState(location.state.pendingOffer || false);
    const [offerAccepted, setOfferAccepted] = useState(location.state.offerAccepted || false);
    const [offerRejected, setOfferRejected] = useState(location.state.offerRejected || false);
    const [isBookmarked, setIsBookmarked] = useState(location.state.isBookmarked || null);
    const [submitted, setSubmitted] = useState(location.state.applied || false);

    const datePosted = new Date(job.datePosted);
    const currentDate = new Date();
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const daysAgo = Math.round(Math.abs((currentDate - datePosted) / oneDay));

    // Button handlers
    const handleBookmarkToggle = async () => {
        // Use the functional form of setState to ensure the correct value is used
        setIsBookmarked(prevIsBookmarked => !prevIsBookmarked);
        
        try {
            const response = await axios.put(apiRoutes.job.individualBookmarks, {
                userId,
                jobId: job._id,
                isBookmarked: !isBookmarked, // Toggle the bookmark status
            });
            console.log("Bookmark updated successfully:", response.data);
        } catch (error) {
            console.error("Error updating bookmark:", error);
        }
    };


    const handleVisitWebsite = () => {
        console.log("Visit Website");
        let websiteUrl = job.postedBy.website;
        // Check if the website URL is available and prepend with 'http://' if missing
        if (websiteUrl && !websiteUrl.startsWith("http")) {
            websiteUrl = "http://" + websiteUrl;
        }
        // Open the website in a new tab
        window.open(websiteUrl, "_blank");
    };

    // Formats compensation to USD
    const formatCompenstation = (compensation) => {
        let USDollar = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumSignificantDigits: 3,
        });

        return `~ ${USDollar.format(compensation)}/yr`;
    };

    return (
        <>
            <DevNavbar />
            <Stack spacing={0}>
                {/* Hero Section */}
                <Grid
                    container
                    xs={12}
                    sx={{
                        flexGrow: 1,
                        justifyContent: "center",
                        backgroundColor: "#F8F9FA",
                    }}
                >
                    <Grid
                        item
                        xs={12}
                        md={10.1}
                        sx={{
                            p: 6,
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <Stack spacing={"20px"}>
                            {/* Company Logo */}
                            <Avatar
                                size="lg"
                                alt={job.postedBy.name}
                                src="companyLogo"
                                color="primary"
                            />
                            {/* Job Title */}
                            <Typography level="h1" sx={{ width: "100%" }}>
                                {job.title}
                            </Typography>
                            {/* Key Facts */}
                            <Stack
                                direction="row"
                                spacing={2.5}
                                alignItems={"center"}
                            >
                                {/* Company Name */}
                                <Typography level="title-lg">
                                    {job.postedBy.name}
                                </Typography>

                                {/* Applied */}
                                {applied && !pendingOffer && !offerAccepted && !offerRejected && (
                                    <Typography
                                        level="title-lg"
                                        sx={{
                                            color: "#6941C6",
                                        }}
                                        startDecorator={
                                            <img
                                                src={appliedIcon}
                                                width={"24px"}
                                                alt="Applied Icon"
                                            ></img>
                                        }
                                    >
                                        Applied
                                    </Typography>
                                )}

                                {/* Offer Pending */}
                                {pendingOffer && !offerAccepted && !offerRejected && (
                                    <Typography
                                        level="title-lg"
                                        sx={{
                                            color: "#F79009",
                                        }}
                                        startDecorator={
                                            <img
                                                src={offerPendingIcon}
                                                width={"24px"}
                                                alt="Offer Pending Icon"
                                            ></img>
                                        }
                                    >
                                        Offered
                                    </Typography>
                                )}

                                {/* Offer Accepted */}
                                {offerAccepted && (
                                    <Typography
                                        level="title-lg"
                                        sx={{
                                            color: "#027A48",
                                        }}
                                        startDecorator={
                                            <img
                                                src={offerAcceptedIcon}
                                                width={"20px"}
                                                alt="Offer Accepted Icon"
                                            ></img>
                                        }
                                    >
                                        Offer accepted
                                    </Typography>
                                )}

                                {/* Offer Rejected */}
                                {offerRejected && (
                                    <Typography
                                        level="title-lg"
                                        sx={{
                                            color: "#D32F2F",
                                        }}
                                        startDecorator={
                                            <img
                                                src={offerRejectedIcon}
                                                width={"20px"}
                                                alt="Offer Rejected Icon"
                                            ></img>
                                        }
                                    >
                                        Offer rejected
                                    </Typography>
                                )}

                                {/* Company Size */}
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
                                    {job.postedBy.size}
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
                                {/* Bookmark Button */}
                                <IconButton onClick={handleBookmarkToggle}>
                                    <img
                                        src={
                                            isBookmarked
                                                ? bookmarkActiveIcon
                                                : bookmarkInactiveIcon
                                        }
                                        alt="Bookmark"
                                        width={"24px"}
                                    />
                                </IconButton>
                            </Stack>
                        </Stack>
                    </Grid>
                </Grid>
                {/* Details */}
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
                                    {job.description
                                        .split("\n")
                                        .map((line, index) => (
                                            <React.Fragment key={index}>
                                                {line}
                                                <br />
                                            </React.Fragment>
                                        ))}
                                </Typography>
                            </Stack>
                            {/* Requirements */}
                            <Stack spacing={2}>
                                <Typography level="h2">Requirements</Typography>
                                <Typography level="body-lg" color="neutral">
                                    {job.requirement
                                        .split("\n")
                                        .map((line, index) => (
                                            <React.Fragment key={index}>
                                                - {line}
                                                <br />
                                            </React.Fragment>
                                        ))}
                                </Typography>
                            </Stack>
                            {/* About the Company */}
                            <Stack spacing={2}>
                                <Typography level="h2">
                                    About {job.postedBy.name}
                                </Typography>
                                <Typography level="body-lg" color="neutral">
                                    {job.postedBy.overview}
                                </Typography>
                            </Stack>
                            {/* Apply Section */}
                            <Grid
                                container
                                xs={12}
                                justifyContent="center"
                                alignItems="center"
                                backgroundColor="#F8F9FA"
                                p={3}
                                borderRadius={10}
                            >
                                <Grid item md={8}>
                                    <Stack spacing={1}>
                                        <Typography level="h3">
                                            Apply Now
                                        </Typography>
                                        <Typography
                                            level="body-md"
                                            color="neutral"
                                        >
                                            Ready to take the next step in your
                                            career? Apply now!
                                        </Typography>
                                    </Stack>
                                </Grid>
                                <Grid item md={4}>
                                    <DevApplyJob
                                        userId={userId}
                                        jobId={job._id}
                                        applied={applied}
                                        submitted={submitted}
                                        setSubmitted={setSubmitted}
                                    />
                                </Grid>
                            </Grid>
                        </Stack>
                    </Grid>
                    {/* Sidebar */}
                    <Grid item md={3.5} paddingLeft={6}>
                        <Grid item>
                            {/* Apply Now Card */}
                            <Stack
                                p={3}
                                borderRadius={10}
                                backgroundColor="#bcbcbc"
                                spacing={3}
                            >
                                <Stack spacing={1}>
                                    <Typography level="h3">
                                        Apply Now
                                    </Typography>
                                    <Typography level="body-md" color="neutral">
                                        Ready to take the next step in your
                                        career? Apply now!
                                    </Typography>
                                </Stack>
                                <DevApplyJob
                                    userId={userId}
                                    jobId={job._id}
                                    applied={applied}
                                    submitted={submitted}
                                    setSubmitted={setSubmitted}
                                />
                            </Stack>
                        </Grid>
                        <Grid item mt={4}>
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
                                            Posted on
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
                                    {/* Compensation (show if given) */}
                                    {job.compensation && (
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
                                    )}
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
                                {/* Visit Website Button */}
                                <Button
                                    color="neutral"
                                    onClick={handleVisitWebsite}
                                    size="lg"
                                    variant="soft"
                                    startDecorator={
                                        <img
                                            src={visitWebsiteIcon}
                                            width={"20px"}
                                            alt="Visit Website"
                                        ></img>
                                    }
                                    sx={{ "--Button-gap": "8px" }}
                                >
                                    Visit Website
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </Grid>
            </Stack>
            <DevJobRecs />
            <Footer />
        </>
    );
}
