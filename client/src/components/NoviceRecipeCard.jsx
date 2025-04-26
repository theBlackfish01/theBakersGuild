import { useState, useEffect } from "react"; // Ensure useState is imported
import axios from "axios";
import { useNavigate } from "react-router-dom";
// UI Imports
import {
    Box,
    Card,
    CardContent,
    Chip,
    IconButton,
    Link,
    Typography,
    Stack,
    Avatar,
    Grid,
    Button,
    Modal,
    ModalDialog,
    ModalClose,
    DialogTitle,
    DialogContent,
    Alert,
} from "@mui/joy";
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
import PropTypes from "prop-types";

// Routes Import
import { apiRoutes } from "../routes.js";

const NoviceRecipeCard = ({
    job,
    userId,
    setBookmarkedJobs,
    bookmarkedJobs,
    appliedJobs,
    offeredJobs,
   
}) => {
    // To Navigate
    const navigate = useNavigate();

    // Application Status
    const [applied, setApplied] = useState(
        appliedJobs.some((appliedJob) => appliedJob._id === job._id)
    );
  
    const [offerAccepted, setOfferAccepted] = useState(
        offeredJobs.some(
            (offeredJob) =>
                offeredJob._id === job._id && offeredJob.acceptedApplicants.length > 0
        )
    );
    const [offerRejected, setOfferRejected] = useState(
        offeredJobs.some(
            (offeredJob) =>
                offeredJob._id === job._id && offeredJob.rejectedApplicants.length > 0
        )
    );

    const [pendingOffer, setPendingOffer] = useState(
        offeredJobs.some(
            (offeredJob) =>
                offeredJob._id === job._id &&
                !offeredJob.offerAccepted &&
                !offeredJob.offerRejected
        )
    );
    // Modal State
    const [openRejectModal, setOpenRejectModal] = useState(false);
    const [openAcceptModal, setOpenAcceptModal] = useState(false);

    // State to manage bookmark toggle
    const [isBookmarked, setIsBookmarked] = useState(
        bookmarkedJobs.some((bJob) => bJob._id === job._id)
    );

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Hadnling Bookmarks
    const handleBookmarkToggle = async () => {
        // Use the functional form of setState to ensure the correct value is used
        setIsBookmarked((prevIsBookmarked) => !prevIsBookmarked);
        setBookmarkedJobs((prevBookmarkedJobs) => {
            if (!prevBookmarkedJobs.some((bJob) => bJob._id === job._id)) {
                return [...prevBookmarkedJobs, job];
            } else {
                return prevBookmarkedJobs.filter(
                    (bJob) => bJob._id !== job._id
                );
            }
        });

        try {
            const response = await axios.put(apiRoutes.job.updateBookmarks, {
                userId,
                jobId: job._id, // Ensure that job._id is correctly assigned here
                isBookmarked,
            });
            console.log("Bookmark updated successfully:", response.data);
        } catch (error) {
            console.error("Error updating bookmark:", error);
        }
    };
    useEffect(() => {
        setIsBookmarked(bookmarkedJobs.some((bJob) => bJob._id === job._id));
    }, [bookmarkedJobs, job._id]);

    const handleRejectOffer = async () => {
        // API call to reject offer
        setLoading(true);
        try {
            console.log("Job id: ", job._id)
            const response = await axios.post(apiRoutes.job.rejectOffer, {
                userId,
                jobId: job._id,
            });
            console.log("Offer Rejected:", response.data);
            setOfferRejected(true);
            setOfferAccepted(false);
            setPendingOffer(false);
            setLoading(false);
            setOpenRejectModal(false);
        } catch (error) {
            console.error("Error rejecting offer:", error);
            setLoading(false);
            // Handle error (e.g., show error message to user)
        }
    };

    const closeRejectModal = () => {
        if (loading) return;
        setOpenRejectModal(false);
    };

    const handleAcceptOffer = async () => {
        // API call to accept offer
        setLoading(true);
        try {
            // console.log("Job id: " ,job._id)
            const response = await axios.post(apiRoutes.job.acceptOffer, {
                userId,
                jobId: job._id,
            });
            console.log("Offer Accepted:", response.data);
            setOfferAccepted(true);
            setOfferRejected(false);
            setPendingOffer(false);
            setLoading(false);
            setOpenAcceptModal(false);
        } catch (error) {
            console.error("Error accepting offer:", error);
            setLoading(false);
            // Handle error (e.g., show error message to user)
        }
    };

    // Calculate days ago
    const datePosted = new Date(job.datePosted);
    const currentDate = new Date();
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const daysAgo = Math.round(Math.abs((currentDate - datePosted) / oneDay));

    // Handler function for card click
    const handleCardClick = () => {
        console.log("Card Clicked");
        // navigate to job details page
        window.scrollTo(0, 0);
        navigate(`/dev/job`, { state: { userId, job, applied, pendingOffer, offerAccepted, offerRejected , isBookmarked } });
    };

    //Validating Props
    NoviceRecipeCard.propTypes = {
        job: PropTypes.object.isRequired,
        userId: PropTypes.string.isRequired,
        setBookmarkedJobs: PropTypes.func.isRequired,
        bookmarkedJobs: PropTypes.array.isRequired,
        appliedJobs: PropTypes.array.isRequired,
        offeredJobs: PropTypes.array.isRequired,
    };

    return (
        <>
            <Card
                variant="outlined"
                size="md"
                sx={{
                    borderRadius: "12px",
                    border: "1px solid #D0D5DD",
                    boxShadow: "none",
                    backgroundColor: "#f9f5f0",
                }}
            >
                <CardContent>
                    <Stack
                        direction="row"
                        spacing={2}
                        alignItems={"flex-start"}
                    >
                        {/* Company Logo */}
                        <Avatar
                            size="lg"
                            alt={job.postedBy.name}
                            src="companyLogo"
                            color="primary"
                        />

                        <Box sx={{ width: "100%" }}>
                            <Stack direction={"column"} spacing={1.5}>
                                {/* Key Facts + Save Button */}
                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="flex-start"
                                    spacing={2}
                                >
                                    {/* Key Info */}
                                    <Stack
                                        direction={"column"}
                                        spacing={0.5}
                                        onClick={handleCardClick}
                                        sx={{ cursor: "pointer" }}
                                    >
                                        {/* Job Title */}
                                        <Link
                                            level="h3"
                                            color="primary"
                                            sx={{ color: "#101828" }}
                                        >
                                            {job.title}
                                        </Link>
                                        {/* Key facts */}
                                        <Stack
                                            direction="row"
                                            spacing={2}
                                            alignItems={"center"}
                                        >
                                            {/* Company Name */}
                                            <Typography level="title-md">
                                                {job.postedBy.name}
                                            </Typography>

                                            {/* Applied */}
                                            {applied &&
                                                !pendingOffer &&
                                                !offerAccepted &&
                                                !offerRejected && (
                                                    <Typography
                                                        level="body-md"
                                                        sx={{
                                                            color: "#6941C6",
                                                        }}
                                                        startDecorator={
                                                            <img
                                                                src={
                                                                    appliedIcon
                                                                }
                                                                width={"20px"}
                                                            />
                                                        }
                                                    >
                                                        Applied
                                                    </Typography>
                                                )}
                                            {/* Pending Offer */}
                                            {pendingOffer && !offerAccepted && !offerRejected && (
                                                <Typography
                                                    level="body-md"
                                                    sx={{ color: "#F79009" }}
                                                    startDecorator={
                                                        <img
                                                            src={
                                                                offerPendingIcon
                                                            }
                                                            width={"20px"}
                                                        />
                                                    }
                                                >
                                                    Offered
                                                </Typography>
                                            )}
                                            {/* Offer Accepted */}
                                            {offerAccepted && (
                                                <Typography
                                                    level="body-md"
                                                    sx={{ color: "#027A48" }}
                                                    startDecorator={
                                                        <img
                                                            src={
                                                                offerAcceptedIcon
                                                            }
                                                            width={"16px"}
                                                            alt="Company Size"
                                                        />
                                                    }
                                                >
                                                    Offer accepted
                                                </Typography>
                                            )}
                                            {/* Offer Rejected */}
                                            {offerRejected && (
                                                <Typography
                                                    level="body-md"
                                                    sx={{ color: "#D32F2F" }}
                                                    startDecorator={
                                                        <img
                                                            src={
                                                                offerRejectedIcon
                                                            }
                                                            width={"16px"}
                                                            alt="Company Size"
                                                        />
                                                    }
                                                >
                                                    Offer rejected
                                                </Typography>
                                            )}
                                            {/* Company Size */}
                                            <Typography
                                                level="body-md"
                                                startDecorator={
                                                    <img
                                                        src={companySizeIcon}
                                                        width={"20px"}
                                                        alt="Company Size"
                                                    />
                                                }
                                            >
                                                {job.postedBy.size}
                                            </Typography>
                                            {/* Time Posted */}
                                            <Typography
                                                level="body-md"
                                                startDecorator={
                                                    <img
                                                        src={timePostedIcon}
                                                        width={"20px"}
                                                        alt="Time Posted"
                                                    />
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
                                    {/* Bookmark Button */}
                                    <IconButton onClick={handleBookmarkToggle}>
                                        <img
                                            src={
                                                isBookmarked
                                                    ? bookmarkActiveIcon
                                                    : bookmarkInactiveIcon
                                            }
                                            width={"24px"}
                                            alt="Bookmark"
                                        />
                                    </IconButton>
                                </Stack>
                                {/* Job Tags */}
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
                                        {job.jobType}
                                    </Chip>
                                    <Chip
                                        sx={{
                                            "--Chip-radius": "6px",
                                            borderColor: "#D0D5DD",
                                        }}
                                        variant="outlined"
                                    >
                                       {job.preferredTechnologies[0]}
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
                                    <Chip
                                        sx={{
                                            "--Chip-radius": "6px",
                                            borderColor: "#D0D5DD",
                                        }}
                                        variant="outlined"
                                    >
                                        {job.environment}
                                    </Chip>
                                    {/* Add more chips as needed */}
                                </Stack>
                                {/* Accept/Reject Buttons (only shown if offer is pending) */}
                                {pendingOffer && !offerAccepted && !offerRejected &&  (
                                    <Grid
                                        container
                                        direction="row"
                                        justifyContent="flex-start"
                                        alignItems="center"
                                        gap={2}
                                    >
                                        {/* Reject Button */}
                                        <Grid item xs={2.5}>
                                            <Button
                                                variant="outlined"
                                                fullWidth
                                                startDecorator={
                                                    <img
                                                        src={rejectIcon}
                                                        width={"20px"}
                                                        alt="Reject Offer"
                                                    />
                                                }
                                                color="neutral"
                                                sx={{ "--Button-gap": "4px" }}
                                                onClick={() =>
                                                    setOpenRejectModal(true)
                                                }
                                            >
                                                Reject
                                            </Button>
                                        </Grid>
                                        {/* Accept Button */}
                                        <Grid item xs={2.5}>
                                            <Button
                                                variant="soft"
                                                fullWidth
                                                startDecorator={
                                                    <img
                                                        src={acceptIcon}
                                                        width={"18px"}
                                                        alt="Accept Offer"
                                                    />
                                                }
                                                sx={{ "--Button-gap": "4px" }}
                                                onClick={() =>
                                                    setOpenAcceptModal(true)
                                                }
                                            >
                                                Accept
                                            </Button>
                                        </Grid>
                                    </Grid>
                                )}
                            </Stack>
                        </Box>
                    </Stack>
                </CardContent>
            </Card>

            {/* Reject Popup */}
            <Modal open={openRejectModal} onClose={closeRejectModal}>
                <ModalDialog
                    color="neutral"
                    layout="center"
                    size="lg"
                    variant="plain"
                >
                    <ModalClose />
                    <DialogTitle>Reject Offer</DialogTitle>
                    <DialogContent>
                        {" "}
                        Are you sure you want to reject this offer?
                    </DialogContent>
                    <Stack direction="row" justifyContent="flex-start" gap={2}>
                        <Button
                            onClick={closeRejectModal}
                            variant="outlined"
                            color="neutral"
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleRejectOffer}
                            variant="soft"
                            color="danger"
                            loading={loading}
                        >
                            Reject
                        </Button>
                    </Stack>
                    {error && (
                        <Alert variant="soft" color="danger">
                            {error}
                        </Alert>
                    )}
                </ModalDialog>
            </Modal>
            {/* Accept Popup */}
            <Modal
                open={openAcceptModal}
                onClose={() => {
                    if (!loading) setOpenAcceptModal(false);
                }}
            >
                <ModalDialog
                    color="neutral"
                    layout="center"
                    size="lg"
                    variant="plain"
                >
                    <ModalClose />
                    <DialogTitle>Accept Offer</DialogTitle>
                    <DialogContent>
                        Are you sure you want to accept this offer?
                    </DialogContent>
                    <Stack direction="row" justifyContent="flex-start" gap={2}>
                        <Button
                            onClick={() => {
                                if (!loading) setOpenAcceptModal(false);
                            }}
                            variant="outlined"
                            color="neutral"
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAcceptOffer}
                            variant="soft"
                            color="success"
                            loading={loading}
                        >
                            Accept
                        </Button>
                    </Stack>
                    {error && (
                        <Alert variant="soft" color="danger">
                            {error}
                        </Alert>
                    )}
                </ModalDialog>
            </Modal>
        </>
    );
};

export default NoviceRecipeCard;
