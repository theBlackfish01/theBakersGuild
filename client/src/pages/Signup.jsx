import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GlobalStyles, border, display } from "@mui/system";
import PropTypes from "prop-types";

// Assets Imports
import logo from "../assets/logo.png";
import signupBackground from "../assets/temp.png";
import signupCompanyIcon from "../assets/signupCompanyIcon.svg";
import signupDeveloperIcon from "../assets/signupDeveloperIcon.svg";
import radioCheckedIcon from "../assets/radioCheckedIcon.svg";

// UI Imports
import {
    Grid,
    Box,
    Typography,
    Button,
    Checkbox,
    Divider,
    FormControl,
    FormLabel,
    Link,
    List,
    ListItem,
    ListItemDecorator,
    radioClasses,
    Input,
    Stack,
    Radio,
    FormHelperText,
    RadioGroup,
    Alert,
} from "@mui/joy";

// Routes Imports
import { apiRoutes, clientRoutes } from "../routes.js";
import { useAuthContext } from "../components/useAuthContext.jsx";

function CustomRadio({ label, ...props }) {
    return (
        <ListItem variant="outlined" sx={{ mt: 0, mb: 1.5 }}>
            <ListItemDecorator>
                {label === "Developer" ? (
                    <img
                        src={signupDeveloperIcon}
                        alt="Developer Icon"
                        style={{ width: "48px" }}
                    />
                ) : (
                    <img
                        src={signupCompanyIcon}
                        alt="Company Icon"
                        style={{ width: "48px" }}
                    />
                )}
            </ListItemDecorator>
            <Radio
                overlay
                value={label}
                label={label}
                sx={{
                    flexGrow: 1,
                    flexDirection: "row-reverse",
                    pl: "20px",
                }}
                slotProps={{
                    action: ({ checked }) => ({
                        sx: (theme) => ({
                            ...(checked && {
                                inset: -1,
                                border: "2px solid",
                                borderColor: theme.vars.palette.primary[500],
                            }),
                        }),
                    }),
                }}
                checkedIcon={
                    <img
                        src={radioCheckedIcon}
                        alt="Radio Checked Icon"
                        style={{ width: "18px" }}
                    />
                }
                {...props}
            />
        </ListItem>
    );
}
CustomRadio.propTypes = {
    label: PropTypes.string.isRequired,
};

const Signup = () => {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userType, setUserType] = useState("");
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const { dispatch } = useAuthContext();

    const [loading, setLoading] = useState(false);

    const registerUser = async (event) => {
        event.preventDefault();

        // Reset error state
        setError(null);

        // Set loading state
        setLoading(true);

        try {
            // Make API request to register user
            const response = await axios.post(apiRoutes.user.register, {
                firstName,
                lastName,
                email,
                password,
                userType,
            });

            // Handle successful registration
            if (response.data.success) {
                const userId = response.data.user._id;
                console.log(userId)
                localStorage.setItem("user", JSON.stringify(response.data.user));

                dispatch({ type: "LOGIN", payload: { user: response.data.user } });
                if (userType === "Developer") {
                    window.scrollTo(0, 0);
                    navigate(clientRoutes.devProfileSetup, {
                        state: { userId: userId },
                    });
                } else if (userType === "Company") {
                    window.scrollTo(0, 0);
                    navigate(clientRoutes.companyProfileSetup, {
                        state: { userId: userId },
                    });
                }
            }
            // Handle unsuccessful registration
            else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            // Handle registration error
            console.log("The Error at frontend is: ", error);
            setError(error);
        } finally {
            // Reset loading state
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
                    }}
                >
                    {/* Logo */}
                    <Grid
                        sx={{
                            mt: 1,
                            mb: 3,
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
                            Create Account
                        </Typography>
                        <Typography>
                            Sign up as a Baker to get started.
                        </Typography>
                        <Box>
                            <form onSubmit={registerUser}>
                                <Stack gap={2.5} sx={{ mt: 3 }}>
                                    {/* First + Last Name */}
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <FormControl required>
                                                <FormLabel>
                                                    First Name
                                                </FormLabel>
                                                <Input
                                                    type="text"
                                                    name="firstName"
                                                    value={firstName}
                                                    placeholder="First Name"
                                                    onChange={(e) =>
                                                        setFirstName(e.target.value)
                                                    }
                                                    sx={{
                                                        "--Input-focusedHighlight":
                                                            "var(--myCustomColor)",
                                                        "--myCustomColor":
                                                            "#ddc8a8",
                                                    }}
                                                />
                                                {error &&
                                                    error.response.data
                                                        .field ===
                                                    "firstName" && (
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                color: "red",
                                                                fontWeight:
                                                                    "500",
                                                            }}
                                                        >
                                                            {
                                                                error.response
                                                                    .data
                                                                    .message
                                                            }
                                                        </Typography>
                                                    )}
                                            </FormControl>
                                        </Grid>
                                        <Grid xs={6}>
                                            <FormControl required>
                                                <FormLabel>Last Name</FormLabel>
                                                <Input
                                                    type="text"
                                                    name="lastName"
                                                    value={lastName}
                                                    placeholder="Last Name"
                                                    onChange={(e) =>
                                                        setLastName(e.target.value)
                                                    }
                                                />
                                                {error &&
                                                    error.response.data
                                                        .field ===
                                                    "lastname" && (
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                color: "red",
                                                                fontWeight:
                                                                    "500",
                                                            }}
                                                        >
                                                            {
                                                                error.response
                                                                    .data
                                                                    .message
                                                            }
                                                        </Typography>
                                                    )}
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                    {/* Email */}
                                    <FormControl
                                        required
                                        error={
                                            error &&
                                            error.response.data.field === "email"
                                        }
                                    >
                                        <FormLabel>Email</FormLabel>
                                        <Input
                                            type="email"
                                            name="email"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            autoComplete="email"
                                            placeholder="user@example.com"
                                        />
                                        {error &&
                                            error.response.data.field === "email" && (
                                                <FormHelperText>
                                                    {
                                                        error.response.data
                                                            .message
                                                    }
                                                </FormHelperText>
                                            )}
                                    </FormControl>
                                    {/* Password */}
                                    <FormControl
                                        required
                                        error={
                                            error &&
                                            error.response.data.field === "password"
                                        }
                                    >
                                        <FormLabel>Password</FormLabel>
                                        <Input
                                            type="password"
                                            name="password"
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            placeholder="Password"
                                        />
                                        {error &&
                                            error.response.data.field === "password" && (
                                                <FormHelperText>
                                                    {
                                                        error.response.data
                                                            .message
                                                    }
                                                </FormHelperText>
                                            )}
                                    </FormControl>
                                    {/* Radio Group */}
                                    <FormControl required>
                                        <FormLabel> I am a... </FormLabel>
                                        <RadioGroup
                                            aria-label="I am a..."
                                            defaultValue="Developer"
                                            overlay
                                            name="radio-buttons-group"
                                            value={userType}
                                            onChange={(e) =>
                                                setUserType(e.target.value)
                                            }
                                            sx={{
                                                flexDirection: "row",
                                                gap: 1.5,
                                                [`& .${radioClasses.checked}`]: {
                                                    [`& .${radioClasses.action}`]: {
                                                        inset: -1,
                                                        border: "2px solid",
                                                    },
                                                },
                                                [`& .${radioClasses.radio}`]: {
                                                    display: "contents",
                                                    "& > svg": {
                                                        zIndex: 2,
                                                        position: "absolute",
                                                        top: "-8px",
                                                        right: "-8px",
                                                        borderRadius: "50%",
                                                    },
                                                },
                                            }}
                                        >
                                            <List
                                                sx={{
                                                    "--List-gap": "1rem",
                                                    "--ListItem-paddingY": "0.75rem",
                                                    "--ListItem-radius": "8px",
                                                    padding: 0,
                                                    margin: 0,
                                                }}
                                            >
                                                {[{ value: "Developer", label: "Novice" }, { value: "Company", label: "Baker" }].map(({ value, label }) => (
                                                    <CustomRadio key={value} value={value} label={label} />
                                                ))}
                                            </List>

                                        </RadioGroup>
                                    </FormControl>
                                    <Stack spacing={4}>
                                        {/* Terms & Conditions */}
                                        <FormControl required>
                                            <Checkbox
                                                label="Accept Terms & Conditions."
                                                variant="soft"
                                                checked={termsAccepted}
                                                onChange={(e) =>
                                                    setTermsAccepted(e.target.checked)
                                                }
                                            />
                                            <FormHelperText>
                                                Please review our terms and conditions before signing up.
                                            </FormHelperText>
                                        </FormControl>
                                        <Button
                                            type="submit"
                                            fullWidth
                                            loading={loading}
                                            sx={{
                                                backgroundColor: "#F5A25D",
                                                "&:hover": {
                                                    backgroundColor: "#F5A25D",
                                                },
                                            }}
                                        >
                                            Sign up
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            fullWidth
                                            onClick={async () => {
                                                try {
                                                    import api from "../lib/api";
                                                    const res = await api.post("/user/guest");
                                                    dispatch({ type: "LOGIN", payload: res.data });
                                                    localStorage.setItem("user", JSON.stringify(res.data));
                                                    navigate(clientRoutes.devDashboard); // Only use navigate here
                                                } catch (err) {
                                                    console.error("Guest login failed:", err);
                                                }
                                            }}
                                            sx={{
                                                mt: 1.5,
                                                borderColor: "#F5A25D",
                                                color: "#F5A25D",
                                                "&:hover": {
                                                    backgroundColor: "#fdf4ec",
                                                    borderColor: "#F5A25D",
                                                },
                                            }}
                                        >
                                            Continue as Guest
                                        </Button>
                                    </Stack>
                                    {/* Error message for overall form submission */}
                                    {error &&
                                        error.response.data.field === "general" && (
                                            <Alert
                                                variant="soft"
                                                color="danger"
                                            >
                                                {error.response.data.message}
                                            </Alert>
                                        )}
                                    {/* Success message */}
                                    {successMessage && (
                                        <Typography
                                            variant="body2"
                                            sx={{ color: "success.main" }}
                                        >
                                            {successMessage}
                                        </Typography>
                                    )}
                                    <Divider />
                                    <Typography>
                                        Already have an account? &nbsp;
                                        <Link
                                            href="/login"
                                            sx={{
                                                textDecoration: "none",
                                                color: "#F5A25D",
                                                "&:hover": {
                                                    color: "#F5A25D",
                                                },
                                            }}
                                        >
                                            Log in to your account.
                                        </Link>
                                    </Typography>
                                </Stack>
                            </form>
                        </Box>
                    </Grid>
                </Grid>
                {/* Background Column */}
                <Grid item xs={6} sx={{backgroundColor: "#4E342E", p: 0 }} margin={0}>
                    <img
                        src={signupBackground}
                        alt="signupBackground"
                        style={{
                            width: "100%",
                            height: "110vh",
                            objectFit: "cover",
                        }}
                    />
                </Grid>
            </Grid>
        </>
    );
};

export default Signup;
