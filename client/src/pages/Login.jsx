import { useState }        from "react";
import { useNavigate }     from "react-router-dom";
import { Grid, Box, Typography, Button, FormControl, FormLabel, Input, Stack, Alert } from "@mui/joy";
import logo                from "../assets/logo.png";
import loginBackground      from "../assets/temp.png";

import { apiRoutes, clientRoutes } from "../routes.js";
import api                  from "../lib/api.js";
import { useAuthContext }   from "../components/useAuthContext.jsx";

export default function Login() {
    const navigate         = useNavigate();
    const { dispatch }     = useAuthContext();

    const [email, setEmail]       = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading]   = useState(false);
    const [error, setError]       = useState(null);

    const loginBaker = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const res = await api.post(apiRoutes.auth.login, { email, password });
            dispatch({ type:"LOGIN", payload:{ baker: res.data.baker } });
            localStorage.setItem("baker", JSON.stringify(res.data.baker));
            navigate(clientRoutes.home);
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Grid container sx={{ minHeight:"100vh" }}>
            <Grid item xs={12} md={6} p={6} display="flex" flexDirection="column" alignItems="center">
                <img src={logo} alt="logo" width={122} style={{ marginBottom:32 }} />
                <Typography level="h1" mb={1}>Login</Typography>
                <Typography mb={3}>Welcome back, Baker!</Typography>
                <Box component="form" onSubmit={loginBaker} width="100%" maxWidth={420}>
                    <Stack gap={3}>
                        <FormControl required>
                            <FormLabel>Email</FormLabel>
                            <Input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="baker@example.com" />
                        </FormControl>
                        <FormControl required>
                            <FormLabel>Password</FormLabel>
                            <Input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" />
                        </FormControl>
                        <Button type="submit" loading={loading} sx={{ backgroundColor:"#F5A25D" }}>Login</Button>
                        {error && <Alert variant="soft" color="danger">{error}</Alert>}
                        <Typography>New here? <a href={clientRoutes.signup} style={{ color:"#F5A25D", textDecoration:"none" }}>Create an account</a></Typography>
                    </Stack>
                </Box>
            </Grid>
            <Grid item xs={0} md={6} sx={{ display:{ xs:"none", md:"block" } }}>
                <img src={loginBackground} alt="login bg" style={{ width:"100%", height:"100vh", objectFit:"cover" }} />
            </Grid>
        </Grid>
    );
}
