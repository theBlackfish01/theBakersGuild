import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
import defaultRecipeImage from "../assets/bakingImage.png";
import PropTypes from "prop-types";
import { apiRoutes } from "../routes.js";
import api from "../lib/api.js";

const NoviceRecipeCard = ({
                              job,
                              userId,
                              setBookmarkedJobs,
                              bookmarkedJobs,
                              appliedJobs,
                              offeredJobs,
                          }) => {
    const navigate = useNavigate();
    const [applied, setApplied] = useState(appliedJobs.some((appliedJob) => appliedJob._id === job._id));
    const [offerAccepted, setOfferAccepted] = useState(offeredJobs.some((offeredJob) => offeredJob._id === job._id && offeredJob.acceptedApplicants.length > 0));
    const [offerRejected, setOfferRejected] = useState(offeredJobs.some((offeredJob) => offeredJob._id === job._id && offeredJob.rejectedApplicants.length > 0));
    const [pendingOffer, setPendingOffer] = useState(offeredJobs.some((offeredJob) => offeredJob._id === job._id && !offeredJob.offerAccepted && !offeredJob.offerRejected));
    const [openRejectModal, setOpenRejectModal] = useState(false);
    const [openAcceptModal, setOpenAcceptModal] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(bookmarkedJobs.some((bJob) => bJob._id === job._id));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleBookmarkToggle = async () => {
        setIsBookmarked((prev) => !prev);
        setBookmarkedJobs((prev) =>
            prev.some((bJob) => bJob._id === job._id)
                ? prev.filter((bJob) => bJob._id !== job._id)
                : [...prev, job]
        );
        try {
            await api.put(apiRoutes.job.updateBookmarks, {
                userId,
                jobId: job._id,
                isBookmarked,
            });
        } catch (error) {
            console.error("Error updating bookmark:", error);
        }
    };

    useEffect(() => {
        setIsBookmarked(bookmarkedJobs.some((bJob) => bJob._id === job._id));
    }, [bookmarkedJobs, job._id]);

    const handleRejectOffer = async () => {
        setLoading(true);
        try {
            await axios.post(apiRoutes.job.rejectOffer, { userId, jobId: job._id });
            setOfferRejected(true);
            setOfferAccepted(false);
            setPendingOffer(false);
            setLoading(false);
            setOpenRejectModal(false);
        } catch (error) {
            console.error("Error rejecting offer:", error);
            setLoading(false);
        }
    };

    const closeRejectModal = () => { if (!loading) setOpenRejectModal(false); };

    const handleAcceptOffer = async () => {
        setLoading(true);
        try {
            await axios.post(apiRoutes.job.acceptOffer, { userId, jobId: job._id });
            setOfferAccepted(true);
            setOfferRejected(false);
            setPendingOffer(false);
            setLoading(false);
            setOpenAcceptModal(false);
        } catch (error) {
            console.error("Error accepting offer:", error);
            setLoading(false);
        }
    };

    const datePosted = new Date(job.datePosted);
    const daysAgo = Math.round(Math.abs((new Date() - datePosted) / (24 * 60 * 60 * 1000)));

    const handleCardClick = () => {
        window.scrollTo(0, 0);
        navigate(`/dev/job`, { state: { userId, job, applied, pendingOffer, offerAccepted, offerRejected, isBookmarked } });
    };

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
                    backgroundColor: "#fdf8f4",
                }}
            >
                <CardContent>
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                        <Avatar
                            size="lg"
                            alt="Recipe"
                            src={defaultRecipeImage}
                            variant="outlined"
                            sx={{ borderRadius: "12px" }}
                        />

                        <Box sx={{ width: "100%" }}>
                            <Stack direction="column" spacing={1.5}>
                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
                                    <Stack direction="column" spacing={0.5} onClick={handleCardClick} sx={{ cursor: "pointer" }}>
                                        <Link level="h3" color="primary" sx={{ color: "#101828" }}>{job.title}</Link>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Typography level="title-md">{job.postedBy.name}</Typography>
                                            {applied && !pendingOffer && !offerAccepted && !offerRejected && (
                                                <Typography level="body-md" sx={{ color: "#6941C6" }} startDecorator={<img src={appliedIcon} width="20px" />}>Applied</Typography>
                                            )}
                                            {pendingOffer && !offerAccepted && !offerRejected && (
                                                <Typography level="body-md" sx={{ color: "#F79009" }} startDecorator={<img src={offerPendingIcon} width="20px" />}>Offered</Typography>
                                            )}
                                            {offerAccepted && (
                                                <Typography level="body-md" sx={{ color: "#027A48" }} startDecorator={<img src={offerAcceptedIcon} width="16px" alt="Accepted" />}>Offer accepted</Typography>
                                            )}
                                            {offerRejected && (
                                                <Typography level="body-md" sx={{ color: "#D32F2F" }} startDecorator={<img src={offerRejectedIcon} width="16px" alt="Rejected" />}>Offer rejected</Typography>
                                            )}
                                            <Typography level="body-md" startDecorator={<img src={companySizeIcon} width="20px" alt="Company Size" />}>{job.postedBy.size}</Typography>
                                            <Typography level="body-md" startDecorator={<img src={timePostedIcon} width="20px" alt="Posted" />}>{daysAgo === 0 ? "Today" : `${daysAgo} day${daysAgo > 1 ? "s" : ""} ago`}</Typography>
                                        </Stack>
                                    </Stack>
                                    <IconButton onClick={handleBookmarkToggle}>
                                        <img src={isBookmarked ? bookmarkActiveIcon : bookmarkInactiveIcon} width="24px" alt="Bookmark" />
                                    </IconButton>
                                </Stack>
                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                    <Chip sx={{ "--Chip-radius": "6px", borderColor: "#D0D5DD" }} variant="outlined">{job.jobType}</Chip>
                                    <Chip sx={{ "--Chip-radius": "6px", borderColor: "#D0D5DD" }} variant="outlined">{job.preferredTechnologies[0]}</Chip>
                                    <Chip sx={{ "--Chip-radius": "6px", borderColor: "#D0D5DD" }} variant="outlined">{job.experience}</Chip>
                                    <Chip sx={{ "--Chip-radius": "6px", borderColor: "#D0D5DD" }} variant="outlined">{job.environment}</Chip>
                                </Stack>
                                {pendingOffer && !offerAccepted && !offerRejected && (
                                    <Grid container direction="row" justifyContent="flex-start" alignItems="center" gap={2}>
                                        <Grid item xs={2.5}>
                                            <Button variant="outlined" fullWidth startDecorator={<img src={rejectIcon} width="20px" alt="Reject" />} color="neutral" sx={{ "--Button-gap": "4px" }} onClick={() => setOpenRejectModal(true)}>Reject</Button>
                                        </Grid>
                                        <Grid item xs={2.5}>
                                            <Button variant="soft" fullWidth startDecorator={<img src={acceptIcon} width="18px" alt="Accept" />} sx={{ "--Button-gap": "4px" }} onClick={() => setOpenAcceptModal(true)}>Accept</Button>
                                        </Grid>
                                    </Grid>
                                )}
                            </Stack>
                        </Box>
                    </Stack>
                </CardContent>
            </Card>
            <Modal open={openRejectModal} onClose={closeRejectModal}>
                <ModalDialog color="neutral" layout="center" size="lg" variant="plain">
                    <ModalClose />
                    <DialogTitle>Reject Offer</DialogTitle>
                    <DialogContent>Are you sure you want to reject this offer?</DialogContent>
                    <Stack direction="row" justifyContent="flex-start" gap={2}>
                        <Button onClick={closeRejectModal} variant="outlined" color="neutral" disabled={loading}>Cancel</Button>
                        <Button onClick={handleRejectOffer} variant="soft" color="danger" loading={loading}>Reject</Button>
                    </Stack>
                    {error && <Alert variant="soft" color="danger">{error}</Alert>}
                </ModalDialog>
            </Modal>
            <Modal open={openAcceptModal} onClose={() => { if (!loading) setOpenAcceptModal(false); }}>
                <ModalDialog color="neutral" layout="center" size="lg" variant="plain">
                    <ModalClose />
                    <DialogTitle>Accept Offer</DialogTitle>
                    <DialogContent>Are you sure you want to accept this offer?</DialogContent>
                    <Stack direction="row" justifyContent="flex-start" gap={2}>
                        <Button onClick={() => { if (!loading) setOpenAcceptModal(false); }} variant="outlined" color="neutral" disabled={loading}>Cancel</Button>
                        <Button onClick={handleAcceptOffer} variant="soft" color="success" loading={loading}>Accept</Button>
                    </Stack>
                    {error && <Alert variant="soft" color="danger">{error}</Alert>}
                </ModalDialog>
            </Modal>
        </>
    );
};

export default NoviceRecipeCard;