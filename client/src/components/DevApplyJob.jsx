import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

// Routes
import { apiRoutes } from "../routes";

// Custom Assets Imports
import generateIcon from "../assets/generateIcon.svg";

// UI Imports
import {
    Typography,
    Button,
    Stack,
    Modal,
    ModalDialog,
    ModalClose,
    DialogTitle,
    DialogContent,
    FormControl,
    FormLabel,
    Textarea,
    Alert,
    Snackbar,
} from "@mui/joy";

export default function DevApplyJob(props) {
    const [open, setOpen] = useState(false);
    const [coverLetter, setCoverLetter] = useState("");
    const [submitLoading, setSubmitLoading] = useState(false);
    const [generateLoading, setGenerateLoading] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [submitted, setSubmitted] = useState(props.applied);

    const [error, setError] = useState(null);

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        if (!submitLoading && !submitted) {
            setOpen(false);
        }
    };

    const handleGenerateCoverLetter = async () => {
        // // TODO: Implement cover letter generation

        // implementation:
        const jobId = props.jobId; 
        const applicantId = props.userId; 
        
        setGenerateLoading(true);
        try {
            const response = await axios.post('/ai/generate-cover-letter', {
                jobId,
                applicantId
            });

            const coverLetter = response.data.coverLetter
            setCoverLetter(coverLetter);

        } catch (error) {
            console.error('Error generating cover letter:', error);
            setCoverLetter("AI service down at the moment, please try later. (Or maybe show your own creativity ;)");

        } finally {
            setGenerateLoading(false);
        }
    };

    const handleCoverLetterChange = (event) => {
        setCoverLetter(event.target.value);
    };

    const handleApplicationSubmit = async (event) => {
        event.preventDefault();

        // Simulate loading state (remove when implemented)
        setSubmitLoading(true);

        try {
            // Make the API call to submit the application
            const response = await axios.post(apiRoutes.dev.application, {
                userId: props.userId,
                jobId: props.jobId,
                coverLetter: coverLetter,
            });

            console.log("Response Received: ", response);

            // Simulate successful submission
            setOpenSnackbar(true); // Open the snackbar
            setOpen(false); // Close the modal
            setSubmitLoading(false);
            props.setSubmitted(true);
        } catch (error) {
            console.log("Error: ", error);
            // Handle error
            setError(error.response.data.message);
            setSubmitLoading(false);
        }
    };

    const closeSnackbar = () => {
        setOpenSnackbar(false);
    };



    return (
        <>
            <Button
                onClick={handleOpen}
                size="lg"
                fullWidth
                disabled={props.submitted}
            >
                Apply Now
            </Button>
            {submitted && (
                <Typography
                    level="body-xs"
                    color="neutral"
                    align="center"
                    mt={1}
                >
                    You have already applied for this job.
                </Typography>
            )}
            <Modal open={open} onClose={handleClose}>
                <ModalDialog
                    color="neutral"
                    layout="center"
                    size="lg"
                    variant="plain"
                >
                    <ModalClose />
                    <DialogTitle>Apply</DialogTitle>
                    <DialogContent>
                        Please fill in the details below to complete your
                        application.
                    </DialogContent>
                    <form onSubmit={handleApplicationSubmit}>
                        <Stack spacing={4} width={"45vw"}>
                            <FormControl required>
                                <FormLabel>Cover letter</FormLabel>
                                <Textarea
                                    startDecorator={
                                        <Button
                                            size="sm"
                                            variant="soft"
                                            loading={generateLoading}
                                            startDecorator={
                                                <img
                                                    src={generateIcon}
                                                    alt="Generate"
                                                    width={"16px"}
                                                />
                                            }
                                            sx={{ "--Button-gap": "4px" }}
                                            onClick={handleGenerateCoverLetter}
                                        >
                                            Generate with AI
                                        </Button>
                                    }
                                    disabled={generateLoading || submitted}
                                    placeholder="Write your cover letter here... If you are using `Generate with AI`, you are can try multiple times to get the desired response."
                                    value={coverLetter}
                                    onChange={handleCoverLetterChange}
                                    minRows={10}
                                    maxRows={12}
                                    slotProps={{
                                        textarea: { maxLength: 5000 },
                                    }}
                                    endDecorator={
                                        <Typography
                                            level="body-xs"
                                            sx={{ ml: "auto" }}
                                        >
                                            {coverLetter.length} / 5000
                                            characters
                                        </Typography>
                                    }
                                />
                            </FormControl>
                            <Button
                                type="submit"
                                size="lg"
                                fullWidth
                                loading={submitLoading}
                                disabled={submitted}
                            >
                                Submit Application
                            </Button>
                            {error && <Alert color="danger">{error}</Alert>}
                        </Stack>
                    </form>
                </ModalDialog>
            </Modal>
            <Snackbar
                variant="soft"
                color="success"
                open={openSnackbar}
                size="lg"
                onClose={closeSnackbar}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
                endDecorator={
                    <Button
                        onClick={closeSnackbar}
                        size="sm"
                        variant="soft"
                        color="success"
                    >
                        Dismiss
                    </Button>
                }
            >
                Your application was submitted successfully.
            </Snackbar>
        </>
    );
}
