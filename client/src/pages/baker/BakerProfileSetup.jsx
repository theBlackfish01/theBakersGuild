import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

// Icons
import profileSetupIcon from "../../assets/profileSetupIcon.svg";
import Footer from "../../components/Footer.jsx";

// UI Imports
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

// Global constants
import {
  companySizes,
  companyTypes,
  industryTypes,
  countryNames,
} from "../../globalConstants.js";

import { apiRoutes, clientRoutes } from "../../routes.js";

export default function BakerProfileSetup() {
  // State to control the visibility of form sections
  const [currentStep, setCurrentStep] = useState(1);

  // Form fields state
  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState("");
  const [companyType, setCompanyType] = useState("");
  const [country, setCountry] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [companyOverview, setCompanyOverview] = useState("");
  const [companyWorkCulture, setCompanyWorkCulture] = useState("");
  const [companyBenefits, setCompanyBenefits] = useState("");

  // navigation
  const navigate = useNavigate();

  // state received
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem("user"))
  const userId = user.userId
  console.log(userId)

  // Error handling state
  const [error, setError] = useState(null);

  // Navigate to the next form section
  const handleNext = () => {
    if (currentStep === 1) {
      if (!companyName || !website || !companyType || !country) {
        console.log(`companyName: ${companyName}`);
        console.log(`website: ${website}`);
        console.log(`companyType: ${companyType}`);
        console.log(`country: ${country}`);
        setError("Please fill in all the required fields");
        return;
      }
    } else if (currentStep === 2) {
      if (!industry || !companySize) {
        console.log(`companySize: ${companySize}`);
        console.log(`industry: ${industry}`);
        setError("Please fill in all the required fields");
        return;
      }
    } else if (currentStep === 3) {
      if (!companyOverview || !companyWorkCulture || !companyBenefits) {
        console.log(`companyOverview: ${companyOverview}`);
        console.log(`companyWorkCulture: ${companyWorkCulture}`);
        console.log(`companyBenefits: ${companyBenefits}`);
        setError("Please fill in all the required fields");
        return;
      }
    }

    setError(null);

    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  // Navigate to the previous form section
  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // create a new FormData object with the state data
    const requestData = {
      companyName,
      website,
      companyType,
      country,
      industry,
      companySize,
      companyOverview,
      companyWorkCulture,
      companyBenefits,
      userId,
    };


    try {
      const response = await axios.post(
        apiRoutes.company.register,
        requestData
      );

      console.log(response.data);
      window.scrollTo(0, 0);
      navigate(clientRoutes.companyDashboard, { state: { userId: userId } });
    } catch (error) {
      console.error("Error Submitting Form", error);
    }
  };

  return (
    <>
      <Grid
        container
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          justifyContent: "center",
        }}
      >
        <Grid
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
            Please enter some basic information about yourself.
          </Typography>
          <Box sx={{ width: "100%" }}>
            <form onSubmit={handleSubmit}>
              <Stack gap={4}>
                {currentStep === 1 && (
                  <>
                    {/* Step 1: Basic Information */}
                    <FormControl required>
                      <FormLabel>What’s your company name? (If any)</FormLabel>
                      <Input
                        type="text"
                        name="cname"
                        placeholder="Enter company name"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                      />
                    </FormControl>
                    <FormControl required>
                      <FormLabel>What&apos;s your website? (If any)</FormLabel>
                      <Input
                        type="url"
                        name="website"
                        placeholder="https://example.com"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                      />
                    </FormControl>
                    <FormControl required>
                      <FormLabel>What type of baker are you?</FormLabel>
                      <Select
                        name="companyType"
                        placeholder="Select baker type"
                        onChange={(e, value) => {
                          setCompanyType(value);
                        }}
                        value={companyType}
                      >
                        {companyTypes.map((type) => (
                          <Option key={type} value={type}>
                            {type}
                          </Option>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl required>
                      <FormLabel>Where are you based in?</FormLabel>
                      <Autocomplete
                        options={countryNames}
                        placeholder="Select country"
                        onChange={(e, value) => setCountry(value)}
                        value={country}
                      />
                    </FormControl>
                    {/* // Only show the Next button if not on the
                                    last step */}
                    {currentStep < 3 && (
                      <Button
                        onClick={handleNext}
                        sx={{
                          backgroundColor: "#F9F5FF",
                          color: "#F7E7CE",
                          "&:hover": {
                            backgroundColor: "#e3dcf7",
                          },
                        }}
                      >
                        Next
                      </Button>
                    )}
                  </>
                )}
                {currentStep === 2 && (
                  <>
                    {/* Step 2: Company Details */}
                    <FormControl required>
                      <FormLabel>
                        What establishment do you belong to?
                      </FormLabel>
                      <Select
                        name="industry"
                        placeholder="Select establishment"
                        onChange={(e, value) => setIndustry(value)}
                        value={industry}
                      >
                        {industryTypes.map((industry) => (
                          <Option key={industry} value={industry}>
                            {industry}
                          </Option>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl required>
                      <FormLabel>What&rsquo;s your company size?</FormLabel>
                      <Select
                        name="companySize"
                        placeholder="Select company size (no. of employees)"
                        onChange={(e, value) => setCompanySize(value)}
                        value={companySize}
                      >
                        {companySizes.map((size) => (
                          <Option key={size} value={size}>
                            {size}
                          </Option>
                        ))}
                      </Select>
                    </FormControl>
                    <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                      <Grid xs={4}>
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
                      <Grid xs={8}>
                        <Button
                          fullWidth
                          onClick={handleNext}
                          sx={{
                            backgroundColor: "#F9F5FF",
                            color: "#F7E7CE",
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
                {currentStep === 3 && (
                  <>
                    {/* Step 3: Company Culture */}
                    <FormControl required>
                      <FormLabel>
                        Provide a brief overview of yourself
                      </FormLabel>
                      <Textarea
                        name="companyOverview"
                        onChange={(e) => {
                          setCompanyOverview(e.target.value);
                        }}
                        minRows={3}
                        maxRows={6}
                        value={companyOverview}
                      />
                    </FormControl>
                    <FormControl required>
                      <FormLabel>
                        What&rsquo;s the work culture at your restaurant?
                      </FormLabel>
                      <Textarea
                        name="companyWorkCulture"
                        onChange={(e) => {
                          setCompanyWorkCulture(e.target.value);
                        }}
                        minRows={3}
                        maxRows={6}
                        value={companyWorkCulture}
                      />
                    </FormControl>
                    <FormControl required>
                      <FormLabel>
                        What benefits does your restaurant offer?
                      </FormLabel>
                      <Textarea
                        name="companyBenefits"
                        onChange={(e) => {
                          setCompanyBenefits(e.target.value);
                        }}
                        minRows={3}
                        maxRows={6}
                        value={companyBenefits}
                      />
                    </FormControl>

                    <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                      <Grid xs={4}>
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

                      <Grid xs={8}>
                        <Button
                          fullWidth
                          type="submit"
                          sx={{
                            backgroundColor: "#F5A25D",
                            color: "white",
                            "&:hover": {
                              backgroundColor: "#F5A25E", // A slightly darker shade for hover state
                            },
                          }}
                        >
                          Submit
                        </Button>
                      </Grid>
                    </Grid>
                  </>
                )}
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
