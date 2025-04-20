import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

// Routes Import
import { apiRoutes, clientRoutes } from "../routes.js";

// Global constants
import {
    jobTypeOptions,
    environmentOptions,
    countryNames,
    experienceOptions,
    skillOptions,
    languageOptions,
    technologyOptions,
} from "../globalConstants.js";

// Custom Assets Imports
import linkIcon from "../assets/linkIcon.svg";
import githubIcon from "../assets/githubIcon.svg";
import generateIcon from "../assets/generateIcon.svg";

// UI Imports
import {
    Typography,
    Button,
    Stack,
    FormControl,
    FormLabel,
    Input,
    Select,
    Option,
    Textarea,
    Autocomplete,
    Alert,
    Snackbar,
} from "@mui/joy";

export default function DevProfileSettings() {
    const location = useLocation()
    const user = JSON.parse(localStorage.getItem("user"))
    const userId = user.userId
    // form fields (new)
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

    // form fields (current)
    const [currentCountry, setCurrentCountry] = useState("");
    const [currentExperience, setCurrentExperience] = useState("");
    const [currentBio, setCurrentBio] = useState("");
    const [currentSkills, setCurrentSkills] = useState([]);
    const [currentLanguages, setCurrentLanguages] = useState([]);
    const [currentTechnologies, setCurrentTechnologies] = useState([]);
    const [currentInterestedJobType, setCurrentInterestedJobType] =
        useState("");
    const [currentEnvironmentPreference, setCurrentEnvironmentPreference] =
        useState("");
    const [currentPortfolioLink, setCurrentPortfolioLink] = useState("");
    const [currentGithubLink, setCurrentGithubLink] = useState("");

    useEffect(() => {
        const getData = async () => {
          try {
            const response1 = await axios.get(apiRoutes.dev.getProfile, {params: {userId: userId}});

            setCurrentCountry(response1.data.country);
            setCurrentExperience(response1.data.experience);
            setCurrentBio(response1.data.bio);
            setCurrentSkills(response1.data.skills);
            setCurrentLanguages(response1.data.languages);
            setCurrentTechnologies(response1.data.technologies);
            setCurrentInterestedJobType(response1.data.interestedJobType);
            setCurrentEnvironmentPreference(response1.data.environmentPreference);
            setCurrentPortfolioLink(response1.data.portfolio);
            setCurrentGithubLink(response1.data.gitLink)

            setCountry(response1.data.country);
            setExperience(response1.data.experience);
            setBio(response1.data.bio);
            setSkills(response1.data.skills);
            setLanguages(response1.data.languages);
            setTechnologies(response1.data.technologies);
            setInterestedJobType(response1.data.interestedJobType);
            setEnvironmentPreference(response1.data.environmentPreference);
            setPortfolioLink(response1.data.portfolio);
            setGithubLink(response1.data.gitLink)
          } catch (error) {
            console.error("Error getting data:", error);
            // Handle error state or display error message
          }
        };
    
        getData();
      }, []);

    // form validation states
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // generate bio state
    const [generateLoading, setGenerateLoading] = useState(false);

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

    const disableSaveButton = () => {
        // if new values are same as current values, disable save button
        if (
            country === currentCountry &&
            experience === currentExperience &&
            bio === currentBio &&
            skills === currentSkills &&
            languages === currentLanguages &&
            technologies === currentTechnologies &&
            interestedJobType === currentInterestedJobType &&
            environmentPreference === currentEnvironmentPreference &&
            portfolioLink === currentPortfolioLink &&
            githubLink === currentGithubLink
        ) {
            return true;
        }

        // if any of the fields are empty, disable save button
        if (
            country === "" || !country ||
            experience === "" ||
            bio === "" ||
            skills.length === 0 ||
            languages.length === 0 ||
            technologies.length === 0 ||
            interestedJobType === "" ||
            environmentPreference === "" ||
            portfolioLink === "" ||
            githubLink === ""
        ) {
            return true;
        }

        return false;
    };

    const handleGenerateBio = async () => {
        //implementation
        const user_id = userId // sample user id
        setGenerateLoading(true);
        try {
            const response = await axios.post('/ai/generate-dev-bio', {
                userId: user_id 
            });

            const generated_bio = response.data.bio
            setBio(generated_bio)

        } catch (error) {
            console.error('Error generating Bio:', error);
            setBio("AI service down at the moment, please try later. (Or maybe show your own creativity ;) \n \n" + bio);
        } finally {
            setGenerateLoading(false);
        }

    };

    const handleCancel = () => {
        // reset form fields to current values
        setCountry(currentCountry);
        setExperience(currentExperience);
        setBio(currentBio);
        setSkills(currentSkills);
        setLanguages(currentLanguages);
        setTechnologies(currentTechnologies);
        setInterestedJobType(currentInterestedJobType);
        setEnvironmentPreference(currentEnvironmentPreference);
        setPortfolioLink(currentPortfolioLink);
        setGithubLink(currentGithubLink);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // simulating api call
        setLoading(true);
        setTimeout(async () => {
            setLoading(false);
            // create a new FormData object with the state data
        const requestData2 = {
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
            userId
        };
    
        console.log("Request data before sending:", requestData2);
    
        try {
            const response = await axios.patch(apiRoutes.dev.edit, requestData2);
    
            console.log(response.data);
            //navigate(clientRoutes.companyDashboard, { userId: userId });
        } catch (error) {
            console.error("Error Submitting Form", error);
        }
            // update current values
            setCurrentCountry(country);
            setCurrentExperience(experience);
            setCurrentBio(bio);
            setCurrentSkills(skills);
            setCurrentLanguages(languages);
            setCurrentTechnologies(technologies);
            setCurrentInterestedJobType(interestedJobType);
            setCurrentEnvironmentPreference(environmentPreference);
            setCurrentPortfolioLink(portfolioLink);
            setCurrentGithubLink(githubLink);

            // show success snackbar
            setSuccess(true);
        }, 2000);
    };

    return (
        <>
            <Stack spacing={2}>
                <Typography level="h1">Profile</Typography>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        {/* Country */}
                        <FormControl>
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
                        <FormControl>
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
                        <FormControl>
                            <FormLabel>
                                Tell us a little about yourself
                            </FormLabel>
                            <Textarea
                                name="Bio"
                                placeholder="Enter a short bio/description... If you are using `Generate with AI`, you are can try multiple times to get the desired response."
                                onChange={handleBioChange}
                                minRows={8}
                                maxRows={10}
                                value={bio}
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
                                        onClick={handleGenerateBio}
                                    >
                                        Generate with AI
                                    </Button>
                                }
                                endDecorator={
                                    <Typography
                                        level="body-xs"
                                        sx={{ ml: "auto" }}
                                    >
                                        {bio.length} / 2000 characters
                                    </Typography>
                                }
                                slotProps={{
                                    textarea: { maxLength: 2000 },
                                }}
                            />
                        </FormControl>
                        {/* Skills */}
                        <FormControl>
                            <FormLabel>
                                Skills (select all that apply)
                            </FormLabel>
                            <Autocomplete
                                name="skills"
                                options={skillOptions}
                                placeholder="Select skills"
                                multiple
                                onChange={handleSkillsChange}
                                value={skills}
                            />
                        </FormControl>
                        {/* Programming Languages */}
                        <FormControl>
                            <FormLabel>
                                Programming Languages (select all that apply)
                            </FormLabel>
                            <Autocomplete
                                name="languages"
                                options={languageOptions}
                                placeholder="Select languages"
                                multiple
                                onChange={handleLanguagesChange}
                                value={languages}
                            />
                        </FormControl>
                        {/* Technologies */}
                        <FormControl>
                            <FormLabel>
                                Technologies (select all that apply)
                            </FormLabel>
                            <Autocomplete
                                name="technologies"
                                options={technologyOptions}
                                placeholder="Select technologies"
                                onChange={handleTechnologiesChange}
                                multiple
                                value={technologies}
                            />
                        </FormControl>
                        {/* Job Type */}
                        <FormControl>
                            <FormLabel>
                                What’s your interested job type?
                            </FormLabel>
                            <Select
                                name="jobType"
                                placeholder="Select job type"
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
                        <FormControl>
                            <FormLabel>
                                What’s your environment preference?
                            </FormLabel>
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
                        {/* Portfolio Link */}
                        <FormControl>
                            <FormLabel>Link to your portfolio</FormLabel>
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
                            <FormLabel>Link to your Github profile</FormLabel>
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
                        {/* Form Submission */}
                        <Stack
                            direction="row"
                            spacing={2}
                            justifyContent="flex-end"
                        >
                            {/* Cancel Button */}
                            <Button
                                color="neutral"
                                variant="outlined"
                                size="lg"
                                disabled={loading}
                                onClick={handleCancel}
                            >
                                Cancel
                            </Button>
                            {/* Save Changes Button */}
                            <Button
                                size="lg"
                                type="submit"
                                disabled={disableSaveButton()}
                                loading={loading}
                            >
                                Save Changes
                            </Button>
                        </Stack>
                        {/* Error Alert */}
                        {error && (
                            <Alert color="danger" variant="soft">
                                ⚠️ {error}
                            </Alert>
                        )}
                        {/* Success Snackbar */}
                        <Snackbar
                            variant="soft"
                            color="success"
                            open={success}
                            size="lg"
                            onClose={() => setSuccess(false)}
                            anchorOrigin={{
                                vertical: "top",
                                horizontal: "center",
                            }}
                            endDecorator={
                                <Button
                                    onClick={() => setSuccess(false)}
                                    size="sm"
                                    variant="soft"
                                    color="success"
                                >
                                    Dismiss
                                </Button>
                            }
                        >
                            Your profile was updated successfully.
                        </Snackbar>
                    </Stack>
                </form>
            </Stack>
        </>
    );
}
