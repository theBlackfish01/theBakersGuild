// client/src/pages/Signup.jsx
import { useNavigate } from "react-router-dom";
import { Grid, Box, Typography, Button, FormControl, FormLabel, Input, Stack, Alert } from "@mui/joy";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import logo from "../assets/logo.png";
import signupBackground from "../assets/temp.png";
import { apiRoutes, clientRoutes } from "../routes.js";
import api from "../lib/api.js";
import { useAuthContext } from "../components/useAuthContext.jsx";

const schema = yup.object({
    name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().min(8).required(),
    bio: yup.string(),
});

export default function Signup() {
    const navigate = useNavigate();
    const { dispatch } = useAuthContext();
    const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm({ resolver: yupResolver(schema) });

    const onSubmit = async (data) => {
        try {
            const res = await api.post(apiRoutes.auth.register, { ...data, questions: {} });
            dispatch({ type: "LOGIN", payload: { baker: res.data.baker } });
            localStorage.setItem("baker", JSON.stringify(res.data.baker));
            navigate(clientRoutes.home);
        } catch (err) {
            const msg = err.response?.data?.message || "Registration failed";
            setError("root", { message: msg });
        }
    };

    return (
        <Grid container sx={{ minHeight: "100vh" }}>
            {/* form */}
            <Grid item xs={12} md={6} p={6} display="flex" flexDirection="column" alignItems="center">
                <img src={logo} alt="logo" width={122} style={{ marginBottom: 32 }} />
                <Typography level="h1" mb={1}>Create Baker Account</Typography>
                <Typography mb={3}>Share your favourite recipes with the guild.</Typography>
                <Box component="form" onSubmit={handleSubmit(onSubmit)} width="100%" maxWidth={420}>
                    <Stack gap={3}>
                        <FormControl required error={!!errors.name}>
                            <FormLabel>Name</FormLabel>
                            <Input placeholder="Jane Dough" {...register("name")} />
                        </FormControl>
                        <FormControl required error={!!errors.email}>
                            <FormLabel>Email</FormLabel>
                            <Input type="email" placeholder="baker@example.com" {...register("email")} />
                        </FormControl>
                        <FormControl required error={!!errors.password}>
                            <FormLabel>Password</FormLabel>
                            <Input type="password" placeholder="••••••••" {...register("password")} />
                        </FormControl>
                        <FormControl error={!!errors.bio}>
                            <FormLabel>Short Bio</FormLabel>
                            <Input placeholder="I love sourdough & chocolate." {...register("bio")} />
                        </FormControl>
                        <Button type="submit" loading={isSubmitting} sx={{ backgroundColor: "#F5A25D" }}>Sign up</Button>
                        {errors.root && <Alert variant="soft" color="danger">{errors.root.message}</Alert>}
                        <Typography>Already a member? <a href={clientRoutes.login} style={{ color: "#F5A25D", textDecoration: "none" }}>Log in</a></Typography>
                    </Stack>
                </Box>
            </Grid>
            {/* bg */}
            <Grid item xs={0} md={6} sx={{ display: { xs: "none", md: "block" } }}>
                <img src={signupBackground} alt="signup bg" style={{ width: "100%", height: "100vh", objectFit: "cover" }} />
            </Grid>
        </Grid>
    );
}