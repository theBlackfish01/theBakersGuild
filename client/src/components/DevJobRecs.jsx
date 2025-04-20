import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

// Routes
import { apiRoutes, clientRoutes } from "../routes";

// Custom Assets
import arrowLeftIcon from "../assets/arrowLeftIcon.svg";
// Assets Imports
import companySizeIcon from "../assets/companySizeIcon.svg";
import timePostedIcon from "../assets/timePostedIcon.svg";
import bookmarkActiveIcon from "../assets/bookmarkActiveIcon.svg";
import bookmarkInactiveIcon from "../assets/bookmarkInactiveIcon.svg";
import appliedIcon from "../assets/appliedIcon.svg";
import offerAcceptedIcon from "../assets/offerAcceptedIcon.svg";
import offerRejectedIcon from "../assets/offerRejectedIcon.svg";
import offerPendingIcon from "../assets/offerPendingIcon.svg";
import acceptIcon from "../assets/acceptIcon.svg";
import rejectIcon from "../assets/rejectIcon.svg";

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
} from "@mui/joy";

export default function DevJobRecs() {
    // View All Jobs Handler
    const navigate = useNavigate();
    const location = useLocation()
    const jobId = location.state.job._id
    const user = JSON.parse(localStorage.getItem("user"))
    const userId = user.userId
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [key, setKey] = useState(0);
    const {applied , offerAccepted , offerRejected ,pendingOffer} = location.state
    
    

    const viewAllJobsHandler = () => {
        // Navigate to the search jobs page
        window.scrollTo(0, 0);
        navigate(clientRoutes.devDashboard, { state: location.state });
    };

    const handleCardClick = (job) => {
        // Redirect to job details page
        window.scrollTo(0, 0);
        navigate(`/dev/job`, { state: { userId, job, applied, pendingOffer, offerAccepted, offerRejected , isBookmarked } });
       
    };

    //Fetching Related Jobs

    useEffect(() => {
        const fetchRelatedJobs = async () => {
            try {
                const response = await axios.get(apiRoutes.job.getRelatedJobs, {
                    params: { userId, jobId},
                });
                console.log(response.data)
                // Calculate days ago for each job
                const jobsWithDaysAgo = response.data.jobsToSend.map((job) => {
                    const datePosted = new Date(job.datePosted);
                    const currentDate = new Date();
                    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                    const daysAgo = Math.round(Math.abs((currentDate - datePosted) / oneDay));
                    return { ...job, daysAgo };
                });
    
                setJobs(jobsWithDaysAgo);
            } catch (error) {
                console.error("Error fetching related jobs:", error);
            }
        };
    
        fetchRelatedJobs();
    }, [location, userId, jobId]); 

    const handleBookmarkToggle = async (jobToUpdate) => {
        try {
            const updatedJobs = jobs.map(job => {
                if (job._id === jobToUpdate._id) {
                    return { ...job, isBookmarked: !job.isBookmarked };
                }
                return job;
            });
    
            // Update the state with the new jobs array
            setJobs(updatedJobs);
    
            // Send the update to the backend
           const response= await axios.put(apiRoutes.job.individualBookmarks, {
                userId,
                jobId: jobToUpdate._id,
                isBookmarked: !jobToUpdate.isBookmarked,
            });

            console.log("Respone: ",response)
        } catch (error) {
            console.error("Error toggling bookmark:", error);
        }
    };
    


    return (
        <>
            <Grid
                container
                flexGrow
                justifyContent={"center"}
                backgroundColor={"#9fc5e8"}
            >
                <Grid
                    item
                    md={10}
                    p={6}
                    display={"flex"}
                    flexDirection={"column"}
                >
                    <Stack spacing={4}>
                        {/* Heading */}
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            spacing={2}
                        >
                            <Typography level="h1">Related Jobs</Typography>
                            <Button
                                onClick={viewAllJobsHandler}
                                size="lg"
                                variant="soft"
                                endDecorator={
                                    <img
                                        src={arrowLeftIcon}
                                        alt="arrow-left-icon"
                                        width={"20px"}
                                    />
                                }
                            >
                                View All Jobs
                            </Button>
                        </Stack>
                        {/* Job Recommendations - Only 3 Recs */}
                        <Grid container spacing={2}>
                            {jobs.map((job) => (
                                <Grid item md={4} key={job._id} >
                                    <Card
                                        variant="outlined"
                                        size="lg"
                                        sx={{
                                            borderRadius: "12px",
                                            border: "1px solid #D0D5DD",
                                            boxShadow: "none",
                                            backgroundColor: "#9fc5e8",
                                        }}
                                    >
                                        <CardContent>
                                            <Stack
                                                direction="row"
                                                justifyContent="space-between"
                                                alignItems="flex-start"
                                                spacing={2}
                                                mb={2}
                                            >
                                                {/* Company Logo */}
                                                <Avatar
                                                    size="lg"
                                                    alt="CompanyLogo"
                                                    src="companyLogo"
                                                    color="primary"
                                                />
                                                {/* Bookmark Button */}
                                                <IconButton
                                                    onClick={() => handleBookmarkToggle(job)}
                                                >
                                                    <img
                                                        src={
                                                                job.isBookmarked
                                                                ? bookmarkActiveIcon
                                                                : bookmarkInactiveIcon
                                                        }
                                                        width={"24px"}
                                                        alt="Bookmark"
                                                    />
                                                </IconButton>
                                            </Stack>
    
                                            <Stack spacing={0}>
                                                {/* Job Title */}
                                                <Link
                                                    level="h4"
                                                    color="primary"
                                                    sx={{ color: "#101828" }}
                                                    mb={1}
                                                    onClick={() => handleCardClick(job)}
                                                >
                                                    {job.title}
                                                </Link>
    
                                                {/* Key Facts */}
                                                <Stack
                                                    direction="row"
                                                    spacing={2}
                                                    alignItems={"center"}
                                                    flexWrap="wrap"
                                                    useFlexGap
                                                    mb={1}
                                                >
                                                    {/* Company Name */}
                                                    <Typography level="title-md">
                                                        {job.postedBy.name}
                                                    </Typography>
                                                    {/* Time Posted */}
                                                    <Typography
                                                        level="body-md"
                                                        startDecorator={
                                                            <img
                                                                src={timePostedIcon}
                                                                width={"18px"}
                                                                alt="Time Posted"
                                                            />
                                                        }
                                                    >  
                                                        {job.daysAgo === 0
                                                        ? "Today"
                                                        : `${job.daysAgo} day${
                                                            job.daysAgo > 1 ? "s" : ""
                                                        } ago`}
                                                    </Typography>
                                                </Stack>
    
                                                {/* Chips - Display max of 4 chips */}
                                                <Stack
                                                    direction="row"
                                                    spacing={1}
                                                    flexWrap="wrap"
                                                    useFlexGap
                                                >
                                                    {/* Example Chips */}
                                                    <Chip
                                                        sx={{
                                                            "--Chip-radius": "6px",
                                                            borderColor: "#D0D5DD",
                                                        }}
                                                        variant="outlined"
                                                    >
                                                        {job.preferredLanguages[0]}
                                                    </Chip>
                                                    <Chip
                                                        sx={{
                                                            "--Chip-radius": "6px",
                                                            borderColor: "#D0D5DD",
                                                        }}
                                                        variant="outlined"
                                                    >
                                                        {job.jobType}
                                                    </Chip>
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
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Stack>
                </Grid>
            </Grid>
        </>
    );
}
