import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

// Route Imports
import { apiRoutes, clientRoutes } from "../routes";

// Assets Imports
import applicantCountryIcon from "../assets/applicantCountryIcon.svg";
import portfolioIcon from "../assets/portfolioIcon.svg";
import githubIcon from "../assets/githubIcon.svg";
import offerAcceptedIcon from "../assets/offerAcceptedIcon.svg";
import offerRejectedIcon from "../assets/offerRejectedIcon.svg";
import offerPendingIcon from "../assets/offerPendingIcon.svg";
import shortlistIconActive from "../assets/shortlistIconActive.svg";
import shortlistIconInactive from "../assets/shortlistIconInactive.svg";
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
    Alert,
    Box,
    Tooltip,
    Modal,
    ModalDialog,
    ModalClose,
    DialogTitle,
    DialogContent,
} from "@mui/joy";

export default function ApplicantCardNew({ applicant , jobId }) {
    const [status, setStatus] = useState(applicant.status || "Applied");
    const [shortlisted, setShortlisted] = useState(applicant.status || false);
    const [bestMatch, setBestMatch] = useState(false);


    console.log("Applicant in applicant card: ",applicant)

    const [openRejectModal, setOpenRejectModal] = useState(false);
    const [openAcceptModal, setOpenAcceptModal] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const handleApplicantNameClick = () => {
        // TODO: open application cover letter popup
        alert(applicant.coverLetter);
    };
    const handlePortfolioClick = () => {
        // TODO: open portfolio link in new tab
        window.open(applicant.applicant.portfolio, "_blank");
    };
    const handleGithubClick = () => {
        // TODO: open github link in new tab
        window.open(applicant.applicant.gitLink, "_blank");
    };
    const handleShortlistToggle = async () => {
        try {
            // Toggle the shortlist status locally
            console.log("Shortlist" )
            setShortlisted((prevShortlisted) => !prevShortlisted);
    
            // Make the API call to update the shortlist status
           const response =  await axios.put(apiRoutes.job.updateToggleStatus, { jobId, devId: applicant.applicant._id, shortlisted: !shortlisted });

           console.log("Response: ",response)
        } catch (error) {
            // If the API call fails, revert the local state to the previous value
            setShortlisted((prevShortlisted) => !prevShortlisted);
            console.error("Failed to update shortlist status:", error);
            setError("Failed to update shortlist status");
        }
    };

    const handleAcceptOffer = async () => {
        console.log("In Send OFfer")
        setLoading(true);
        try {
            // Send API call to send offer
            console.log("Dev ID: ",applicant.applicant._id)
            const response = await axios.post(apiRoutes.job.sendJobOffer, { jobId  , devId : applicant.applicant._id });
            console.log("Response: ",response)
            // Update status and close modal on successful offer
            setStatus("Offer Sent");
            setLoading(false);
            closeAcceptModal();
        } catch (error) {
            console.error("Error sending offer:", error);
            setLoading(false);
            // Handle error as needed
            setError(error)
        }
    };
    const closeAcceptModal = () => {
        if (!loading) {
            setOpenAcceptModal(false);
        }
    };
    const handleRejectOffer = async () => {
        setLoading(true);
        // TODP: API call to reject offer

        // Simulate API call (remove when API is integrated)
        setTimeout(() => {
            setStatus("Rejected");
            setLoading(false);
            closeRejectModal();
        }, 2000);
    };
    const closeRejectModal = () => {
        if (!loading) {
            setOpenRejectModal(false);
        }
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
                    backgroundColor: "#9fc5e8",
                }}
            >
                <CardContent>
                    <Stack
                        direction="row"
                        spacing={2}
                        alignItems={"flex-start"}
                    >
                        {/* Applicant Initials */}
                        <Avatar
                            size="lg"
                            alt={applicant.username} // TODO: Replace alt with applicant name
                            src="companyLogo"
                            color="primary"
                        />
                        <Box sx={{ width: "100%" }}>
                            <Stack spacing={1.5}>
                                {/* Key Facts + Shortlist Button */}
                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="flex-start"
                                    spacing={2}
                                >
                                    {/* Key Info */}
                                    <Stack spacing={1}>
                                        {/* Applicant Name */}
                                        <Link
                                            level="h3"
                                            color="primary"
                                            sx={{ color: "#101828" }}
                                            onClick={handleApplicantNameClick}
                                        >
                                            {applicant.username}
                                        </Link>
                                        {/* Key Facts */}
                                        <Stack
                                            direction="row"
                                            spacing={2}
                                            alignItems={"center"}
                                        >
                                            {/* Offer Sent */}
                                            {status === "Offer Sent" && (
                                                <Typography
                                                    level="body-md"
                                                    sx={{ color: "#F79009" }}
                                                    startDecorator={
                                                        <img
                                                            src={
                                                                offerPendingIcon
                                                            }
                                                            width={"20px"}
                                                            alt="Github"
                                                        />
                                                    }
                                                >
                                                    Offer Sent
                                                </Typography>
                                            )}
                                            {/* Offer Rejected */}
                                            {status === "Offer Rejected" && (
                                                <Typography
                                                    level="body-md"
                                                    sx={{ color: "#D32F2F" }}
                                                    startDecorator={
                                                        <img
                                                            src={
                                                                offerRejectedIcon
                                                            }
                                                            width={"20px"}
                                                            alt="Github"
                                                        />
                                                    }
                                                >
                                                    Offer Rejected
                                                </Typography>
                                            )}
                                            {/* Rejected */}
                                            {status === "Rejected" && (
                                                <Typography
                                                    level="body-md"
                                                    sx={{ color: "#D32F2F" }}
                                                    startDecorator={
                                                        <img
                                                            src={
                                                                offerRejectedIcon
                                                            }
                                                            width={"16px"}
                                                        />
                                                    }
                                                >
                                                    Rejected
                                                </Typography>
                                            )}
                                            {/* Offer Accepted */}
                                            {status === "Offer Accepted" && (
                                                <Typography
                                                    level="body-md"
                                                    sx={{ color: "#027A48" }}
                                                    startDecorator={
                                                        <img
                                                            src={
                                                                offerAcceptedIcon
                                                            }
                                                            width={"16px"}
                                                        />
                                                    }
                                                >
                                                    Offer Accepted
                                                </Typography>
                                            )}
                                            {/* Applicant Country */}
                                            <Typography
                                                level="body-md"
                                                startDecorator={
                                                    <img
                                                        src={
                                                            applicantCountryIcon
                                                        }
                                                        width={"20px"}
                                                        alt="Company Size"
                                                    />
                                                }
                                            >
                                                {applicant.applicant.country}
                                            </Typography>
                                            {/* Portfolio Link */}
                                            <Typography
                                                level="body-md"
                                                startDecorator={
                                                    <img
                                                        src={portfolioIcon}
                                                        width={"20px"}
                                                        alt="Portfolio"
                                                    />
                                                }
                                                onClick={handlePortfolioClick}
                                                sx={{ cursor: "pointer" }}
                                            >
                                                Portfolio
                                            </Typography>
                                            {/* Github Link */}
                                            <Typography
                                                level="body-md"
                                                startDecorator={
                                                    <img
                                                        src={githubIcon}
                                                        width={"20px"}
                                                        alt="Github"
                                                    />
                                                }
                                                onClick={handleGithubClick}
                                                sx={{ cursor: "pointer" }}
                                            >
                                                Github
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                    {/* Shortlist Button */}
                                    <Tooltip
                                        color="primary"
                                        placement="top"
                                        variant="soft"
                                        title={
                                            shortlisted
                                                ? "Remove from Shortlist"
                                                : "Shortlist"
                                        }
                                    >
                                        <IconButton
                                            onClick={handleShortlistToggle}
                                        >
                                            <img
                                                src={
                                                    shortlisted
                                                        ? shortlistIconActive
                                                        : shortlistIconInactive
                                                }
                                                width={"24px"}
                                                alt="Shortlist"
                                            />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                                {/* Applicant Tags */}
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    flexWrap="wrap"
                                    useFlexGap
                                >
                                    {/* display if best match (A job can have only 1 best match) */}
                                    {bestMatch && (
                                        <Chip
                                            sx={{
                                                "--Chip-radius": "6px",

                                                border: "1px solid #B19BE3",
                                            }}
                                            variant="soft"
                                            color="primary"
                                        >
                                            Best Match
                                        </Chip>
                                    )}
                                    {/* Convert all Skills + Technologies + Prog. Languages into 1 list and map over chips */}
                                    <Chip
                                        sx={{
                                            "--Chip-radius": "6px",
                                            borderColor: "#D0D5DD",
                                        }}
                                        variant="outlined"
                                    >
                                        {applicant.applicant.skills[0]}
                                    </Chip>
                                    <Chip
                                        sx={{
                                            "--Chip-radius": "6px",
                                            borderColor: "#D0D5DD",
                                        }}
                                        variant="outlined"
                                    >
                                        {applicant.applicant.technologies[0]}
                                    </Chip>
                                    <Chip
                                        sx={{
                                            "--Chip-radius": "6px",
                                            borderColor: "#D0D5DD",
                                        }}
                                        variant="outlined"
                                    >
                                        {applicant.applicant.languages[0]}
                                    </Chip>
                                </Stack>
                                {/* Send Offer / Reject Buttons */}
                                {status === "Applied" && (
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
                                        {/* Send Offer Button */}
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
                                                Send Offer
                                            </Button>
                                        </Grid>
                                    </Grid>
                                )}
                            </Stack>
                        </Box>
                    </Stack>
                </CardContent>
            </Card>
            {/* Accept Modal */}
            <Modal open={openAcceptModal} onClose={closeAcceptModal}>
                <ModalDialog
                    color="neutral"
                    layout="center"
                    size="lg"
                    variant="plain"
                >
                    <ModalClose />
                    <DialogTitle>Send Offer</DialogTitle>
                    <DialogContent>
                        Are you sure you want to send offer to this applicant?
                    </DialogContent>
                    <Stack direction="row" justifyContent="flex-start" gap={2}>
                        <Button
                            variant="outlined"
                            color="neutral"
                            onClick={closeAcceptModal}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="soft"
                            onClick={handleAcceptOffer}
                            color="success"
                            loading={loading}
                        >
                            Send Offer
                        </Button>
                    </Stack>
                    {error && (
                        <Alert variant="soft" color="danger">
                            {error}
                        </Alert>
                    )}
                </ModalDialog>
            </Modal>
            {/* Reject Modal */}
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
                        Are you sure you want to reject offer to this applicant?
                    </DialogContent>
                    <Stack direction="row" justifyContent="flex-start" gap={2}>
                        <Button
                            variant="outlined"
                            color="neutral"
                            onClick={closeRejectModal}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="soft"
                            onClick={handleRejectOffer}
                            color="danger"
                            loading={loading}
                        >
                            Reject Offer
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
}
