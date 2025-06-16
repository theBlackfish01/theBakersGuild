import { useState }        from "react";
import { useNavigate }     from "react-router-dom";
import { Grid, Box, Typography, Button, FormControl, FormLabel, Input, Stack, Alert } from "@mui/joy";
import logo                from "../assets/logo.png";
import signupBackground    from "../assets/temp.png";

import { apiRoutes, clientRoutes } from "../routes.js";
import api                  from "../lib/api.js";
import { useAuthContext }   from "../components/useAuthContext.jsx";

export default function Signup() {
    const navigate           = useNavigate();
    const { dispatch }       = useAuthContext();

    const [name,     setName]     = useState("");
    const [email,    setEmail]    = useState("");
    const [password, setPassword] = useState("");
    const [bio,      setBio]      = useState("");
    const [loading,  setLoading]  = useState(false);
    const [error,    setError]    = useState(null);

    const registerBaker = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const res = await api.post(apiRoutes.auth.register, {
                name,
                email,
                password,
                bio,
                questions: {},
            });
            dispatch({ type:"LOGIN", payload:{ baker: res.data.baker } });
            localStorage.setItem("baker", JSON.stringify(res.data.baker));
            navigate(clientRoutes.home);
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Grid container sx={{ minHeight:"100vh" }}>
            {/* left column – form */}
            <Grid item xs={12} md={6} p={6} display="flex" flexDirection="column" alignItems="center">
                <img src={logo} alt="logo" width={122} style={{ marginBottom:32 }} />

                <Typography level="h1" mb={1}>Create Baker Account</Typography>
                <Typography mb={3}>Share your favourite recipes with the guild.</Typography>

                <Box component="form" onSubmit={registerBaker} width="100%" maxWidth={420}>
                    <Stack gap={3}>
                        <FormControl required>
                            <FormLabel>Name</FormLabel>
                            <Input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Jane Dough" />
                        </FormControl>
                        <FormControl required>
                            <FormLabel>Email</FormLabel>
                            <Input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="baker@example.com" />
                        </FormControl>
                        <FormControl required>
                            <FormLabel>Password</FormLabel>
                            <Input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Short Bio</FormLabel>
                            <Input value={bio} onChange={(e)=>setBio(e.target.value)} placeholder="I love sourdough & chocolate." />
                        </FormControl>
                        <Button type="submit" loading={loading} sx={{ backgroundColor:"#F5A25D" }}>Sign up</Button>
                        {error && <Alert variant="soft" color="danger">{error}</Alert>}
                        <Typography>Already a member? <a href={clientRoutes.login} style={{ color:"#F5A25D", textDecoration:"none" }}>Log in</a></Typography>
                    </Stack>
                </Box>
            </Grid>

            {/* right column – image */}
            <Grid item xs={0} md={6} sx={{ display:{ xs:"none", md:"block" } }}>
                <img src={signupBackground} alt="signup bg" style={{ width:"100%", height:"100vh", objectFit:"cover" }} />
            </Grid>
        </Grid>
    );
}
