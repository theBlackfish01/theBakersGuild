import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

// Routes Import
import { apiRoutes, clientRoutes } from "../routes.js";

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
    Alert,
    Snackbar,
} from "@mui/joy";

export default function DeleteAccount() {
    // status
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const [accountDeleted, setAccountDeleted] = useState(false);
    const navigate = useNavigate();
    const location = useLocation()
    const userId = location.state.userId

    const handleCancel = () => {
        // refresh the page
        window.location.reload();
    };
    const handleDeleteAccount = () => {
        // open confirm modal
        setOpenConfirmModal(true);
    };
    const closeConfirmModal = () => {
        // don't close if loading
        if (loading) return;

        setOpenConfirmModal(false);
    };

    const confirmDeleteAccount = async () => {
        // simulate
        setLoading(true);
        setTimeout(async () => {
            try {
            const response0 = await axios.delete(apiRoutes.user.delete, {params: {userId: userId}});
            console.log(response0)
            const response = await axios.delete(apiRoutes.company.delete, {params: {userId: userId}});
            console.log(response)
            if (response.data.success==="false") {
                const response1 = await axios.delete(apiRoutes.dev.delete, {params: {userId: userId}});
                console.log(response1)
                const response2 = await axios.delete(apiRoutes.job.deleteApplicant, {params: {userId: userId}});
                console.log(response2)
            }
            else {
                const response3 = await axios.delete(apiRoutes.job.delete, {params: {userId: userId}});
                console.log(response3)
            }
        }
        catch {
            setError("This user does not exist")
        }
            // close modal
            setLoading(false);
            setOpenConfirmModal(false);

            // show snackbar
            setAccountDeleted(true);
            window.scrollTo(0, 0);
            navigate(clientRoutes.signup, { userId: userId });
        }, 2000);
    };

    return (
        <Stack spacing={2}>
            <Typography level="h1">Delete Account</Typography>
            <Stack spacing={4}>
                <Typography level="body-lg">
                    Are you absolutely sure you want to delete your
                    account? Deleting your account means all your associated
                    data will be permanently removed from our platform.
                    <b>
                        {" "}
                        Please be aware that once you delete your account, it
                        cannot be restored.
                    </b>
                </Typography>
                {/* Actions */}
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                    {/* Cancel Button */}
                    <Button
                        color="neutral"
                        variant="outlined"
                        size="lg"
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                    {/* Save Changes Button */}
                    <Button
                        size="lg"
                        color="danger"
                        onClick={handleDeleteAccount}
                    >
                        Delete Account
                    </Button>
                </Stack>
            </Stack>
            {/* Confirm Modal */}
            <Modal open={openConfirmModal} onClose={closeConfirmModal}>
                <ModalDialog
                    color="neutral"
                    layout="center"
                    size="lg"
                    variant="plain"
                >
                    <ModalClose />
                    <DialogTitle>Delete Account</DialogTitle>
                    <DialogContent>
                        Are you sure you want to delete your account?
                    </DialogContent>
                    {/* Actions */}
                    <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="flex-end"
                        mt={1}
                        mb={1}
                    >
                        {/* Cancel Button */}
                        <Button
                            color="neutral"
                            variant="outlined"
                            size="lg"
                            onClick={closeConfirmModal}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        {/* Delete Account */}
                        <Button
                            size="lg"
                            color="danger"
                            onClick={confirmDeleteAccount}
                            loading={loading}
                        >
                            Delete Account
                        </Button>
                    </Stack>
                    {/* Error */}
                    {error && (
                        <Alert color="danger" variant="soft">
                            ⚠️ {error}
                        </Alert>
                    )}
                </ModalDialog>
            </Modal>
            {/* Account Deleted Snackbar */}
            <Snackbar
                variant="soft"
                color="neutral"
                open={accountDeleted}
                size="lg"
                onClose={() => setAccountDeleted(false)}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
                endDecorator={
                    <Button
                        onClick={() => setAccountDeleted(false)}
                        size="sm"
                        variant="soft"
                        color="neutral"
                    >
                        Dismiss
                    </Button>
                }
            >
                Your account has been deleted.
            </Snackbar>
        </Stack>
    );
}
