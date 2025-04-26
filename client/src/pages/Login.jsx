import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import loginBackground from "../assets/temp.png";
import {
  Alert,
  Grid,
  Box,
  Typography,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Link,
  Input,
  Stack,
} from "@mui/joy";
import { GlobalStyles, border, display } from "@mui/system";
import { apiRoutes, clientRoutes } from "../routes.js";
import { useAuthContext } from "../components/useAuthContext.jsx";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { dispatch } = useAuthContext();

    const loginUser = async (event) => {
        event.preventDefault();

        // Reset error
        setError(null);

        // Set loading to true
        setLoading(true);

        try {
            const response = await axios.post(apiRoutes.user.login, {
                email,
                password,
            });

            if (response.data.success) {

                localStorage.setItem("user", JSON.stringify(response.data.user));
                const userType = response.data.userType;
                const userId = response.data.userId;
                console.log("UserType: ", response.data);

                dispatch({ type: "LOGIN", payload: { user: response.data.user} });

                if (userType === "Developer") {
                    console.log("Developer");
                    window.scrollTo(0, 0);
                    navigate(clientRoutes.devDashboard, {
                        state: { userId: userId },
                    });
                } else if (userType === "Company") {
                    console.log("Company");
                    window.scrollTo(0, 0);
                    navigate(clientRoutes.companyDashboard, {
                        state: { userId: userId },
                    });
                } else {
                    // Handle unknown userType
                    console.log("Unknown userType:", userType);
                }
            }
            else {
                setError(response.data.message);
                console.log(response.data);
            }
        } catch (error) {
            // Handle registration error
            console.log("The Error at frontend is: ", error);
            setError(error.response.data.message);
        } finally {
            // Set loading to false
            setLoading(false);
        }
    };

    return (
        <>
            <GlobalStyles styles={{ body: { margin: 0, padding: 0 } }} />
            <Grid container sx={{ flexGrow: 1, minHeight: "100vh" }}>
                <Grid
                    container
                    item
                    xs={6}
                    sx={{
                        p: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        // maxHeight: "100vh",
                    }}
                >
                    {/* Logo */}
                    <Grid
                        sx={{
                            mt: 1,
                            mb: 4,
                            display: "flex",
                            alignItems: "space-between",
                            flexDirection: "row",
                            justifyContent: "center",
                        }}
                        xs={12}
                    >
                        <img src={logo} alt="logo" style={{ width: "122px" }} />
                    </Grid>
                    <Grid item xs={8}>
                        <Typography level="h1" sx={{ mb: 1 }}>
                            Login
                        </Typography>
                        <Typography>
                            Welcome back!
                        </Typography>

                        <Box>
                            <form onSubmit={loginUser}>
                                <Stack gap={4} sx={{ mt: 4 }}>
                                    <FormControl required>
                                        <FormLabel>Email</FormLabel>
                                        <Input
                                            type="email"
                                            name="email"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                        />
                                    </FormControl>
                                    <FormControl required>
                                        <FormLabel>Password</FormLabel>
                                        <Input
                                            type="password"
                                            name="password"
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                        />
                                    </FormControl>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        sx={{
                                            backgroundColor: "#F5A25D",
                                        }}
                                        loading={loading}
                                    >
                                        Login
                                    </Button>
                                    {error && (
                                        <Alert variant="soft" color="danger">
                                            {error}
                                        </Alert>
                                    )}
                                    <Divider></Divider>
                                    <Typography>
                                        Don't have an account? &nbsp;
                                        <Link
                                            href="/"
                                            sx={{ color: "#F5A25D" }}
                                        >
                                            Sign up to create an account.
                                        </Link>
                                    </Typography>
                                </Stack>
                            </form>
                        </Box>
                    </Grid>
                </Grid>
                <Grid
                    item
                    xs={6}
                    sx={{ backgroundColor: "#4E342E", maxHeight: "100%" }}
                >
                    <img
                        src={loginBackground}
                        alt="loginBackground"
                        style={{
                            width: "100%",
                            height: "99.5vh",
                            objectFit: "cover",
                        }}
                    />
                </Grid>
            </Grid>
        </>
    );
}
