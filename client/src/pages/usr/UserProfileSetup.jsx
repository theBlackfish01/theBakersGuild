import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

// Global constants
import {
  jobTypeOptions,
  environmentOptions,
  countryNames,
  experienceOptions,
  skillOptions,
  languageOptions,
  technologyOptions,
} from "../../globalConstants.js";

// Custom components
import Footer from "../../components/Footer.jsx";
import Navbar from "../../components/GuestNavbar.jsx";

// UI imports
import {
  Grid,
  Box,
  Typography,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Select,
  Option,
  Textarea,
  Autocomplete,
  Alert,
} from "@mui/joy";

// custom assets
import profileSetupIcon from "../../assets/profileSetupIcon.svg";
import githubIcon from "../../assets/githubIcon.svg";
import linkIcon from "../../assets/linkIcon.svg";

// Routes Import
import { apiRoutes, clientRoutes } from "../../routes.js";

export default function UserProfileSetup() {
  // form fields
  const [country, setCountry] = useState("");
  const [experience, setExperience] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [interestedJobType, setInterestedJobType] = useState("");
  const [environmentPreference, setEnvironmentPreference] = useState("");
  const [portfolioLink, setPortfolioLink] = useState("");
  const [githubLink, setGithubLink] = useState("");

  // navigation
  const navigate = useNavigate();

  // state received
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"))
  const userId = user.userId

  // form validation
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // form step
  const [currentStep, setStep] = useState(1);

  // event handlers
  const handleCountryChange = (e, value) => {
    setCountry(value);
  };
  const handleExperienceChange = (e, value) => {
    setExperience(value);
  };
  const handleBioChange = (e) => {
    setBio(e.target.value);
  };
  const handleSkillsChange = (e, value) => {
    setSkills(value);
  };
  const handleLanguagesChange = (e, value) => {
    setLanguages(value);
  };
  const handleTechnologiesChange = (e, value) => {
    setTechnologies(value);
  };
  const handleJobTypeChange = (e, value) => {
    setInterestedJobType(value);
  };
  const handleEnvironmentChange = (e, value) => {
    setEnvironmentPreference(value);
  };
  const handlePortfolioLinkChange = (e) => {
    setPortfolioLink(e.target.value);
  };
  const handleGithubLinkChange = (e) => {
    setGithubLink(e.target.value);
  };

  // go to next section
  const handleNext = () => {
    // validate form fields before moving to next step
    if (currentStep === 1) {
      if (!country || !experience || !bio) {
        setError("Please fill all the required fields.");
        return;
      }
    } else if (currentStep === 3) {
      if (!interestedJobType || !environmentPreference) {
        setError("Please fill all the required fields.");
        return;
      }
    }

    setError("");

    // scroll to top of the page
    window.scrollTo(0, 0);

    // move to next step
    if (currentStep < 4) setStep(currentStep + 1);
  };

  // go to previous section
  const handleBack = () => {
    // move to previous step
    if (currentStep > 1) setStep(currentStep - 1);
  };

  // form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(apiRoutes.dev.register, {
        userId,
        country,
        experience,
        bio,
        skills,
        languages,
        technologies,
        interestedJobType,
        environmentPreference,
        portfolioLink,
        githubLink,
      });

      setLoading(false);
      window.scrollTo(0, 0);
      navigate(clientRoutes.devDashboard, { state: {userId: userId }});
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("Error submitting form. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar currentPage={"dashboard"} />
      <Grid
        container
        sx={{
          flexGrow: 1,
          minHeight: "90vh",
          justifyContent: "center",
        }}
      >
        <Grid
          item
          xs={12}
          md={4.5}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            src={profileSetupIcon}
            alt="profileSetup icon"
            style={{ width: "56px", marginBottom: "30px" }}
          />
          <Typography level="h1" sx={{ mb: 2, textAlign: "center" }}>
            Let’s set up your account
          </Typography>
          <Typography level="body-md" sx={{ mb: 4, textAlign: "center" }}>
            Please enter some basic information about yourself to get started.
          </Typography>
          <Box sx={{ width: "100%" }}>
            <form onSubmit={handleSubmit}>
              <Stack gap={4}>
                {/* First Stage */}
                {currentStep === 1 && (
                  <>
                    {/* Country */}
                    <FormControl required>
                      <FormLabel>Where are you based in?</FormLabel>
                      <Autocomplete
                        name="country"
                        options={countryNames}
                        placeholder="Select country"
                        onChange={handleCountryChange}
                        value={country}
                      />
                    </FormControl>
                    {/* Experience */}
                    <FormControl required>
                      <FormLabel>
                        How many years of experience do you have?
                      </FormLabel>
                      <Select
                        name="experience"
                        placeholder="Select experience (in years)"
                        onChange={handleExperienceChange}
                        value={experience}
                      >
                        {experienceOptions.map((option) => (
                          <Option key={option} value={option}>
                            {option}
                          </Option>
                        ))}
                      </Select>
                    </FormControl>
                    {/* Bio */}
                    <FormControl required>
                      <FormLabel>Tell us a little about yourself</FormLabel>
                      <Textarea
                        name="Bio"
                        placeholder="Enter a short bio/description..."
                        onChange={handleBioChange}
                        minRows={4}
                        maxRows={6}
                        value={bio}
                      />
                    </FormControl>
                  </>
                )}
                {/* Second Stage */}
                {currentStep === 2 && (
                  <>
                    {/* Skills */}
                    <FormControl>
                      <FormLabel>Experience </FormLabel>
                      <Autocomplete
                        name="skills"
                        options={skillOptions}
                        placeholder="Select Experience"
                        multiple
                        onChange={handleSkillsChange}
                        value={skills}
                      />
                    </FormControl>
                    {/* Programming Languages */}
                    <FormControl>
                      <FormLabel>
                        Skill level
                      </FormLabel>
                      <Autocomplete
                        name="languages"
                        options={languageOptions}
                        placeholder="Select skill level"
                        multiple
                        onChange={handleLanguagesChange}
                        value={languages}
                      />
                    </FormControl>
                    {/* Technologies */}
                    <FormControl>
                      <FormLabel>
                        Interests
                      </FormLabel>
                      <Autocomplete
                        name="technologies"
                        options={technologyOptions}
                        placeholder="Select Interests"
                        onChange={handleTechnologiesChange}
                        multiple
                        value={technologies}
                      />
                    </FormControl>
                  </>
                )}
                {/* Third Stage */}
                {currentStep === 3 && (
                  <>
                    {/* Job Type */}
                    <FormControl required>
                      <FormLabel>What’s your preferred recipe difficulty?</FormLabel>
                      <Select
                        name="jobType"
                        placeholder="Select difficulty"
                        onChange={handleJobTypeChange}
                        value={interestedJobType}
                      >
                        {jobTypeOptions.map((option) => (
                          <Option key={option} value={option}>
                            {option}
                          </Option>
                        ))}
                      </Select>
                    </FormControl>
                    {/* Environment Preference */}
                    <FormControl required>
                      <FormLabel>What’s your environment preference?</FormLabel>
                      <Select
                        name="environment"
                        placeholder="Select environment"
                        onChange={handleEnvironmentChange}
                        value={environmentPreference}
                      >
                        {environmentOptions.map((option) => (
                          <Option key={option} value={option}>
                            {option}
                          </Option>
                        ))}
                      </Select>
                    </FormControl>
                  </>
                )}
                {/* Fourth Stage */}
                {currentStep === 4 && (
                  <>
                    {/* Portfolio Link */}
                    <FormControl>
                      <FormLabel>Link to your portfolio (optional)</FormLabel>
                      <Input
                        name="portfolioLink"
                        type="url"
                        placeholder="https://www.example.com"
                        onChange={handlePortfolioLinkChange}
                        value={portfolioLink}
                        startDecorator={
                          <img
                            src={linkIcon}
                            alt="link icon"
                            style={{
                              width: "20px",
                            }}
                          />
                        }
                      />
                    </FormControl>
                    {/* Github Link */}
                    <FormControl>
                      <FormLabel>
                        Link to your Github profile (optional)
                      </FormLabel>
                      <Input
                        name="githubLink"
                        type="url"
                        placeholder="https://github.com/username"
                        onChange={handleGithubLinkChange}
                        value={githubLink}
                        startDecorator={
                          <img
                            src={githubIcon}
                            alt="github icon"
                            style={{
                              width: "20px",
                            }}
                          />
                        }
                      />
                    </FormControl>
                  </>
                )}
                {/* 1st Stage Nav Btn */}
                {currentStep === 1 && (
                  <Button
                    fullWidth
                    type="button"
                    sx={{
                      backgroundColor: "#F9F5FF",
                      color: "#F5A25D",
                      "&:hover": {
                        backgroundColor: "#e3dcf7",
                      },
                    }}
                    loading={loading}
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                )}
                {/* 2nd + 3rd Stage Btns */}
                {currentStep > 1 && currentStep < 4 && (
                  <>
                    <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                      {/* Back Button */}
                      <Grid item xs={4}>
                        <Button
                          fullWidth
                          onClick={handleBack}
                          sx={{
                            backgroundColor: "#FFFFFF",
                            color: "#344054",
                            border: "1px solid #D0D5DD",
                            "&:hover": {
                              backgroundColor: "#fafafa",
                              borderColor: "#bfc4ca",
                            },
                          }}
                        >
                          Back
                        </Button>
                      </Grid>
                      {/* Next Button */}
                      <Grid item xs={8}>
                        <Button
                          fullWidth
                          onClick={handleNext}
                          sx={{
                            backgroundColor: "#F9F5FF",
                            color: "#F5A25D",
                            "&:hover": {
                              backgroundColor: "#e3dcf7",
                            },
                          }}
                        >
                          Next
                        </Button>
                      </Grid>
                    </Grid>
                  </>
                )}
                {/* Submisstion (4th Stage) Btn*/}
                {currentStep === 4 && (
                  <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                    {/* Back Button */}
                    <Grid item xs={4}>
                      <Button
                        fullWidth
                        onClick={handleBack}
                        sx={{
                          backgroundColor: "#FFFFFF",
                          color: "#344054",
                          border: "1px solid #D0D5DD",
                          "&:hover": {
                            backgroundColor: "#fafafa",
                            borderColor: "#bfc4ca",
                          },
                        }}
                      >
                        Back
                      </Button>
                    </Grid>
                    {/* Submit Button */}
                    <Grid item xs={8}>
                      <Button
                        fullWidth
                        type="submit"
                        sx={{
                          backgroundColor: "#F5A25D",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "#F5A25D",
                          },
                        }}
                        loading={loading}
                      >
                        Complete Profile
                      </Button>
                    </Grid>
                  </Grid>
                )}
                {/* Error Alert */}
                {error && (
                  <Alert variant="soft" color="danger">
                    {error}
                  </Alert>
                )}
              </Stack>
            </form>
          </Box>
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}
