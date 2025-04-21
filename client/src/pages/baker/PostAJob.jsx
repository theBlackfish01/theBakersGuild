import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

// Global constants
import {
    jobTypeOptions,
    environmentOptions,
    experienceOptions,
    skillOptions,
    languageOptions,
    technologyOptions,
} from "../../globalConstants.js";

// Custom components
import CompanyNavbar from "../../components/CompanyNavbar.jsx";
import Footer from "../../components/Footer.jsx";

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
  FormHelperText,
} from "@mui/joy";

// Routes Import
import { apiRoutes, clientRoutes } from "../../routes.js";

export default function PostAJob() {
    // form fields state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [requirement, setRequirement] = useState("");
    const [preferredSkills, setPreferredSkills] = useState([]);
    const [preferredLanguages, setPreferredLanguages] = useState([]);
    const [preferredTechnologies, setPreferredTechnologies] = useState([]);
    const [experience, setExperience] = useState("");
    const [jobType, setJobType] = useState("");
    const [environment, setEnvironment] = useState("");
    const [compensation, setCompensation] = useState("");

  const [validCompensation, setValidCompensation] = useState(true);

  // state received
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem("user"))
  const userId = user.userId
  console.log(userId)


  const [generateLoading, setGenerateLoading] = useState(false);


    // form validation
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


  // navigation
  const navigate = useNavigate();

    // step state
    const [currentStep, setStep] = useState(1);



  // handle form field changes
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };
  const handleRequirementChange = (e) => {
    setRequirement(e.target.value);
  };
  const handleSkillsChange = (e, value) => {
    setPreferredSkills(value);
  };
  const handleLanguagesChange = (e, value) => {
    setPreferredLanguages(value);
  };
  const handleTechnologiesChange = (e, value) => {
    setPreferredTechnologies(value);
  };
  const handleExperienceChange = (e, value) => {
    setExperience(value);
  };
  const handleJobTypeChange = (e, value) => {
    setJobType(value);
  };
  const handleEnvironmentChange = (e, value) => {
    setEnvironment(value);
  };
  const handleCompensationChange = (e) => {
    setCompensation(e.target.value);
  };


  // go to next step
  const handleNext = () => {
    // validate required form fields
    if (currentStep === 1) {
      if (!title || !requirement) {
        setError("Please fill in all required fields.");
        return;
      }
    } else if (currentStep === 2) {
      if (!experience) {
        setError("Please select a preferred experience level.");
        return;
      }
    } else if (currentStep === 3) {
      if (!jobType || !environment || !description) {
        setError("Please fill in all required fields.");
        return;
      }
    }

    setError("");

    // scroll to top of the page
    window.scrollTo(0, 0);

    // move to next step
    if (currentStep < 3) setStep(currentStep + 1);
  };

  // go to previous step
  const handleBack = () => {
    if (currentStep > 1) setStep(currentStep - 1);
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // validate compensation if it is not empty
    if (compensation) {
        if (compensation < 1000 || compensation > 1000000) {
            setValidCompensation(false);
            setLoading(false);
            return;
        }
    }

    // create a data object to send in the request
    const requestData = {
        title,
        description,
        requirement,
        preferredSkills,
        preferredLanguages,
        preferredTechnologies,
        experience,
        jobType,
        environment,
        compensation,
        userId,
    };

    console.log("Request data before sending:", requestData);
    try {
        // Send a POST request to the server
        const response = await axios.post(
            apiRoutes.job.create,
            requestData
        );

        console.log("Response:", response.data);

        // Navigate to the dashboard or handle the response accordingly
        window.scrollTo(0, 0);
        navigate(clientRoutes.companyDashboard, { userId: userId });
    } catch (error) {
        console.error("Error submitting form:", error);
        // Handle error state or display error message
    }

    setLoading(false);
};

  return (
    <>
      <CompanyNavbar currentPage="postJob" />
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
          md={6}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            level="h1"
            sx={{ mb: 2, textAlign: "left", width: "100%" }}
          >
            Create a Recipe Post ✍️
          </Typography>
          <Typography level="body-lg" sx={{ mb: 4, width: "100%" }}>
            Let’s get started on posting your recipe. Please fill in the
            following fields:
          </Typography>
          <Box sx={{ width: "100%" }}>
            <form onSubmit={handleSubmit}>
              <Stack gap={4}>
                {/* Step 1 */}
                {currentStep === 1 && (
                  <>
                    <Typography level="h3">
                      Step 1 of 3: Basic Information
                    </Typography>
                    {/* Job Title */}
                    <FormControl required>
                      <FormLabel>Recipe title</FormLabel>
                      <Input
                        type="text"
                        placeholder="Choose a descriptive and fun name for your recipe"
                        onChange={handleTitleChange}
                        value={title}
                      />
                    </FormControl>
                    {/* Minimum Requirements */}
                    <FormControl required>
                      <FormLabel>Ingredient</FormLabel>
                      <Textarea
                        placeholder="Specify the ingredients required for the recipe..."
                        onChange={handleRequirementChange}
                        value={requirement}
                        minRows={6}
                        maxRows={12}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>
                        Where did you learn this recipe from? (select all that apply)
                      </FormLabel>
                      <Autocomplete
                        placeholder="e.g. Fine Dining"
                        multiple
                        options={skillOptions}
                        value={preferredSkills}
                        onChange={handleSkillsChange}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>
                        Recommended experience level (select all that apply)
                      </FormLabel>
                      <Autocomplete
                        placeholder="e.g. Beginner"
                        multiple
                        options={languageOptions}
                        value={preferredLanguages}
                        onChange={handleLanguagesChange}
                      />
                    </FormControl>
                    {/* Next Button */}
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
                  </>
                )}
                {/* Step 2 */}
                {currentStep === 2 && (
                  <>
                    <Typography level="h3">
                      Step 2 of 3: Preferences
                    </Typography>
                    {/* Preferred Technologies */}
                    <FormControl>
                      <FormLabel>
                        Recommended Environment (select all that apply)
                      </FormLabel>
                      <Autocomplete
                        placeholder="e.g. Home"
                        multiple
                        options={technologyOptions}
                        value={preferredTechnologies}
                        onChange={handleTechnologiesChange}
                      />
                    </FormControl>
                    {/* Experience Level */}
                    <FormControl required>
                      <FormLabel>Preferred experience level</FormLabel>
                      <Select
                        placeholder="e.g. 5+ years"
                        value={experience}
                        onChange={handleExperienceChange}
                      >
                        {experienceOptions.map((option) => (
                          <Option key={option} value={option}>
                            {option}
                          </Option>
                        ))}
                      </Select>
                    </FormControl>
                    {/* Back + Next Buttons */}
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
                {/* Step 3 */}
                {currentStep === 3 && (
                  <>
                    <Typography level="h3">
                      Step 3 of 3: Recipe Description
                    </Typography>
                    {/* Job Type */}
                    <FormControl required>
                      <FormLabel>How difficult is this recipe?</FormLabel>
                      <Select
                        placeholder="e.g. Easy"
                        value={jobType}
                        onChange={handleJobTypeChange}
                      >
                        {jobTypeOptions.map((option) => (
                          <Option key={option} value={option}>
                            {option}
                          </Option>
                        ))}
                      </Select>
                    </FormControl>
                    {/* Work Environment */}
                    <FormControl required>
                      <FormLabel>
                        What is the recommended environment for this recipe?
                      </FormLabel>
                      <Select
                        placeholder="e.g. Home"
                        value={environment}
                        onChange={handleEnvironmentChange}
                      >
                        {environmentOptions.map((option) => (
                          <Option key={option} value={option}>
                            {option}
                          </Option>
                        ))}
                      </Select>
                    </FormControl>
                    {/* Compensation */}
                    <FormControl>
                      <FormLabel>Ingredients cost</FormLabel>
                      <Input
                        type="number"
                        placeholder="e.g. Rs. 1000"
                        onChange={handleCompensationChange}
                        value={compensation}
                        startDecorator="$"
                        error={!validCompensation}
                      />
                    </FormControl>
                    {/* Description */}
                    <FormControl required>
                      <FormLabel>Recipe description</FormLabel>
                      <Textarea


                        placeholder="Write your recipe descrption."
                        value={description}
                        onChange={handleDescriptionChange}
                      />
                    </FormControl>
                    {/* Back + Submit Button */}
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
                            color: "white"
                          }}
                          loading={loading}
                        >
                          Create Recipe
                        </Button>
                      </Grid>
                    </Grid>
                  </>
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
