import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

// Routes Import
import { apiRoutes, clientRoutes } from "../routes.js";

// Custom Assets Imports
import generateIcon from "../assets/generateIcon.svg";

// Global constants
import {
    jobTypeOptions,
    environmentOptions,
    countryNames,
    experienceOptions,
    skillOptions,
    languageOptions,
    technologyOptions,
    companySizes,
    companyTypes,
    industryTypes,
} from "../globalConstants.js";

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

export default function CompanyProfileSettings() {
    const location = useLocation()
    const userId = location.state.userId
    // Form fields (new)
    const [companyName, setCompanyName] = useState("");
    const [website, setWebsite] = useState("");
    const [companyType, setCompanyType] = useState("");
    const [country, setCountry] = useState("");
    const [industry, setIndustry] = useState("");
    const [companySize, setCompanySize] = useState("");
    const [companyOverview, setCompanyOverview] = useState("");
    const [companyWorkCulture, setCompanyWorkCulture] = useState("");
    const [companyBenefits, setCompanyBenefits] = useState("");

    // Form fields (current)
    const [currentCompanyName, setCurrentCompanyName] = useState("");
    const [currentWebsite, setCurrentWebsite] = useState("");
    const [currentCompanyType, setCurrentCompanyType] = useState("");
    const [currentCountry, setCurrentCountry] = useState("");
    const [currentIndustry, setCurrentIndustry] = useState("");
    const [currentCompanySize, setCurrentCompanySize] = useState("");
    const [currentCompanyOverview, setCurrentCompanyOverview] = useState("");
    const [currentCompanyWorkCulture, setCurrentCompanyWorkCulture] =
        useState("");
    const [currentCompanyBenefits, setCurrentCompanyBenefits] = useState("");

    useEffect(() => {
        const getData = async () => {
          try {
            const response1 = await axios.get(apiRoutes.company.getProfile, {params: {userId: userId}});
    
            setCurrentCompanyName(response1.data.name);
            setCurrentWebsite(response1.data.website);
            setCurrentCompanyType(response1.data.type);
            setCurrentCountry(response1.data.country);
            setCurrentIndustry(response1.data.industry);
            setCurrentCompanySize(response1.data.size);
            setCurrentCompanyOverview(response1.data.overview);
            setCurrentCompanyWorkCulture(response1.data.workCulture);
            setCurrentCompanyBenefits(response1.data.benefits);

            setCompanyName(response1.data.name);
            setWebsite(response1.data.website);
            setCompanyType(response1.data.type);
            setCountry(response1.data.country);
            setIndustry(response1.data.industry);
            setCompanySize(response1.data.size);
            setCompanyOverview(response1.data.overview);
            setCompanyWorkCulture(response1.data.workCulture);
            setCompanyBenefits(response1.data.benefits);
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

    // event handlers
    const handleCompanyNameChange = (e) => setCompanyName(e.target.value);
    const handleWebsiteChange = (e) => setWebsite(e.target.value);
    const handleCompanyTypeChange = (e, value) => setCompanyType(value);
    const handleCountryChange = (e, value) => setCountry(value);
    const handleIndustryChange = (e, value) => setIndustry(value);
    const handleCompanySizeChange = (e, value) => setCompanySize(value);
    const handleCompanyOverviewChange = (e) =>
        setCompanyOverview(e.target.value);
    const handleCompanyWorkCultureChange = (e) =>
        setCompanyWorkCulture(e.target.value);
    const handleCompanyBenefitsChange = (e) =>
        setCompanyBenefits(e.target.value);

    const disableSaveButton = () => {
        // if new and current values are same, disable save button
        if (
            companyName === currentCompanyName &&
            website === currentWebsite &&
            companyType === currentCompanyType &&
            country === currentCountry &&
            industry === currentIndustry &&
            companySize === currentCompanySize &&
            companyOverview === currentCompanyOverview &&
            companyWorkCulture === currentCompanyWorkCulture &&
            companyBenefits === currentCompanyBenefits
        ) {
            return true;
        }

        // if any of the  fields are empty, disable save button
        if (
            !companyName ||
            !website ||
            !companyType ||
            !country ||
            !industry ||
            !companySize ||
            !companyOverview ||
            !companyWorkCulture ||
            !companyBenefits
        ) {
            return true;
        }

        return false;
    };

    // cancel form submission
    const handleCancel = () => {
        // reset form fields to current values
        setCompanyName(currentCompanyName);
        setWebsite(currentWebsite);
        setCompanyType(currentCompanyType);
        setCountry(currentCountry);
        setIndustry(currentIndustry);
        setCompanySize(currentCompanySize);
        setCompanyOverview(currentCompanyOverview);
        setCompanyWorkCulture(currentCompanyWorkCulture);
        setCompanyBenefits(currentCompanyBenefits);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // simulate loading
        setLoading(true);
        setTimeout(async () => {
            setLoading(false);
            // create a new FormData object with the state data
        const requestData2 = {
            companyName,
            website,
            companyType,
            country,
            industry,
            companySize,
            companyOverview,
            companyWorkCulture,
            companyBenefits,
            userId
        };
    
        console.log("Request data before sending:", requestData2);
    
        try {
            const response = await axios.patch(apiRoutes.company.edit, requestData2);
    
            console.log(response.data);
            //navigate(clientRoutes.companyDashboard, { userId: userId });
        } catch (error) {
            console.error("Error Submitting Form", error);
        }
            // update current values
            setCurrentCompanyName(companyName);
            setCurrentWebsite(website);
            setCurrentCompanyType(companyType);
            setCurrentCountry(country);
            setCurrentIndustry(industry);
            setCurrentCompanySize(companySize);
            setCurrentCompanyOverview(companyOverview);
            setCurrentCompanyWorkCulture(companyWorkCulture);
            setCurrentCompanyBenefits(companyBenefits);

            // show success message
            setSuccess(true);
        }, 2000);
    };

    // loaading states for AI
    const [loadingOverview, setLoadingOverview] = useState(false);
    const [loadingWorkCulture, setLoadingWorkCulture] = useState(false);
    const [loadingBenefits, setLoadingBenefits] = useState(false);

    const generateOverview = async () => {
        setLoadingOverview(true);

        const user_id = userId //Sample Company ID

        setLoadingOverview(true);
        try {
            console.log('hello')
            const response = await axios.post('/ai/generate-company-overview', {
                userId: user_id 
            });

            const generated_overview = response.data.companyOverview
            setCompanyOverview(generated_overview)

        } catch (error) {
            console.error('Error generating Overview:', error);
            setCompanyOverview("AI service down at the moment, please try later. (Or maybe show your own creativity ;) \n \n" + companyOverview);

        } finally {
            setLoadingOverview(false);
        }
    };

    return (
        <Stack spacing={2}>
            <Typography level="h1">Company Profile</Typography>
            <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                    {/* Company Name */}
                    <FormControl>
                        <FormLabel>What’s your company name?</FormLabel>
                        <Input
                            type="text"
                            name="cname"
                            placeholder="Enter company name"
                            value={companyName}
                            onChange={handleCompanyNameChange}
                        />
                    </FormControl>
                    {/* Website */}
                    <FormControl>
                        <FormLabel>What&apos;s your website?</FormLabel>
                        <Input
                            type="url"
                            name="website"
                            placeholder="https://example.com"
                            value={website}
                            onChange={handleWebsiteChange}
                        />
                    </FormControl>
                    {/* Company Type */}
                    <FormControl>
                        <FormLabel>What type of company are you?</FormLabel>
                        <Select
                            name="companyType"
                            placeholder="Select company type"
                            onChange={handleCompanyTypeChange}
                            value={companyType}
                        >
                            {companyTypes.map((type) => (
                                <Option key={type} value={type}>
                                    {type}
                                </Option>
                            ))}
                        </Select>
                    </FormControl>
                    {/* Location */}
                    <FormControl>
                        <FormLabel>Where is your company based in?</FormLabel>
                        <Autocomplete
                            options={countryNames}
                            placeholder="Select country"
                            onChange={handleCountryChange}
                            value={country}
                        />
                    </FormControl>
                    {/* Industry */}
                    <FormControl>
                        <FormLabel>
                            What industry does your company belong to?
                        </FormLabel>
                        <Select
                            name="industry"
                            placeholder="Select industry"
                            onChange={handleIndustryChange}
                            value={industry}
                        >
                            {industryTypes.map((industry) => (
                                <Option key={industry} value={industry}>
                                    {industry}
                                </Option>
                            ))}
                        </Select>
                    </FormControl>
                    {/* Company Size */}
                    <FormControl required>
                        <FormLabel>What&rsquo;s your company size?</FormLabel>
                        <Select
                            name="companySize"
                            placeholder="Select company size (no. of employees)"
                            onChange={handleCompanySizeChange}
                            value={companySize}
                        >
                            {companySizes.map((size) => (
                                <Option key={size} value={size}>
                                    {size}
                                </Option>
                            ))}
                        </Select>
                    </FormControl>
                    {/* Company Overview */}
                    <FormControl>
                        <FormLabel>
                            Provide a brief overview of your company
                        </FormLabel>
                        <Textarea
                            name="companyOverview"
                            onChange={handleCompanyOverviewChange}
                            placeholder="Enter a short description about your company... If you are using `Generate with AI`, you are can try multiple times to get the desired response."
                            minRows={6}
                            maxRows={10}
                            value={companyOverview}
                            startDecorator={
                                <Button
                                    size="sm"
                                    variant="soft"
                                    loading={loadingOverview}
                                    startDecorator={
                                        <img
                                            src={generateIcon}
                                            alt="Generate"
                                            width={"16px"}
                                        />
                                    }
                                    sx={{ "--Button-gap": "4px" }}
                                    onClick={generateOverview}
                                >
                                    Generate with AI
                                </Button>
                            }
                            endDecorator={
                                <Typography level="body-xs" sx={{ ml: "auto" }}>
                                    {companyOverview.length}/2000
                                </Typography>
                            }
                            slotProps={{
                                textarea: { maxLength: 2000 },
                            }}
                        />
                    </FormControl>
                    {/* Company Work Culture */}
                    <FormControl>
                        <FormLabel>
                            What&rsquo;s the work culture at your company?
                        </FormLabel>
                        <Textarea
                            name="companyWorkCulture"
                            onChange={handleCompanyWorkCultureChange}
                            placeholder="Describe your company's work culture..."
                            minRows={6}
                            maxRows={10}
                            value={companyWorkCulture}

                            // Should be inputted from the baker not AI generated
                            // startDecorator={
                            //     <Button
                            //         size="sm"
                            //         variant="soft"
                            //         loading={loadingWorkCulture}
                            //         startDecorator={
                            //             <img
                            //                 src={generateIcon}
                            //                 alt="Generate"
                            //                 width={"16px"}
                            //             />
                            //         }
                            //         sx={{ "--Button-gap": "4px" }}
                            //         onClick={generateWorkCulture}
                            //     >
                            //         Generate with AI
                            //     </Button>
                            // }
                            endDecorator={
                                <Typography level="body-xs" sx={{ ml: "auto" }}>
                                    {companyWorkCulture.length}/2000
                                </Typography>
                            }
                            slotProps={{
                                textarea: { maxLength: 2000 },
                            }}
                        />
                    </FormControl>
                    {/* Company Benefits */}
                    <FormControl>
                        <FormLabel>
                            What benefits does your company offer?
                        </FormLabel>
                        <Textarea
                            name="companyBenefits"
                            onChange={handleCompanyBenefitsChange}
                            placeholder="List the benefits your company offers..."
                            minRows={6}
                            maxRows={10}
                            value={companyBenefits}
                            // Is a fact that should be shared by baker, not AI generated
                            // startDecorator={
                            //     <Button
                            //         size="sm"
                            //         variant="soft"
                            //         loading={loadingBenefits}
                            //         startDecorator={
                            //             <img
                            //                 src={generateIcon}
                            //                 alt="Generate"
                            //                 width={"16px"}
                            //             />
                            //         }
                            //         sx={{ "--Button-gap": "4px" }}
                            //         onClick={generateBenefits}
                            //     >
                            //         Generate with AI
                            //     </Button>
                            // }
                            endDecorator={
                                <Typography level="body-xs" sx={{ ml: "auto" }}>
                                    {companyBenefits.length}/2000
                                </Typography>
                            }
                            slotProps={{
                                textarea: { maxLength: 2000 },
                            }}
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
                    {/* Error */}
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
    );
}
