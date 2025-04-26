import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

// Global Constants
import {
    jobTypeOptions,
    environmentOptions,
    experienceOptions,
    skillOptions,
    languageOptions,
    technologyOptions,
} from "../globalConstants";

// UI Imports
import {
    Typography,
    Button,
    Input,
    Stack,
    Select,
    Option,
    Autocomplete,
    Alert,
    Grid,
} from "@mui/joy";

// Custom Assets Imports
import jobSearchIcon from "../assets/jobSearchIcon.svg";
import sortIcon from "../assets/sortIcon.svg";

// Custom Components Imports
import GuestNavbar from "../components/GuestNavbar.jsx";
import GuestRecipeCard from "../components/GuestRecipeCard.jsx";
import Footer from "../components/Footer";

// Routes Import
import { apiRoutes, clientRoutes } from "../routes.js";

export default function SearchRecipes() {
    // User input states
    const [searchQuery, setSearchQuery] = useState("");
    const [skills, setSkills] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [technologies, setTechnologies] = useState([]);
    const [jobType, setJobType] = useState("");
    const [experience, setExperience] = useState("");
    const [environment, setEnvironment] = useState("");

    // Job search results states
    const [loading, setLoading] = useState(false);
    const [noMoreJobs, setNoMoreJobs] = useState(true);
    const [error, setError] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [bookmarkedJobs, setBookmarkedJobs] = useState([]);
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [offeredJobs, setOfferedJobs] = useState([]);
    const [sortBy, setSortBy] = useState("newest");

    const navigate = useNavigate();

    // state received
    const location = useLocation();
    const userId = location.state.userId;

    // Function to fetch jobs based on search criteria
    const fetchJobs = async (searchQuery,
        skills,
        languages,
        technologies,
        jobType,
        experience,
        environment) => {
        try {
            setLoading(true);
            let response = await axios.get(apiRoutes.job.getAll, {
                params: { userId },
            });

            console.log("Response: ", response);

            // Destructure the response data
            const { allJobs, bookmarkedJobs, appliedJobs, offeredJobs } = response.data;

            // Update the state variables
            setJobs(allJobs);
            setBookmarkedJobs(bookmarkedJobs);
            setAppliedJobs(appliedJobs);
            setOfferedJobs(offeredJobs);

            let filteredJobs = allJobs.slice();

            // Apply filters
            if (searchQuery) {
                filteredJobs = filteredJobs.filter((job) =>
                    job.title.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }
            if (skills.length > 0) {
                filteredJobs = filteredJobs.filter(
                    (job) =>
                        job.preferredSkills &&
                        skills.some((skill) =>
                            job.preferredSkills
                                .map((skill) => skill.toLowerCase())
                                .includes(skill.toLowerCase())
                        )
                );
            }
            if (languages.length > 0) {
                filteredJobs = filteredJobs.filter((job) => {
                    return (
                        job.preferredLanguages &&
                        languages.some((language) => {
                            return job.preferredLanguages
                                .map((lang) => lang.toLowerCase())
                                .includes(language.toLowerCase());
                        })
                    );
                });
            }
            if (technologies.length > 0) {
                filteredJobs = filteredJobs.filter(
                    (job) =>
                        job.preferredTechnologies &&
                        technologies.some((technology) =>
                            job.preferredTechnologies
                                .map((tech) => tech.toLowerCase())
                                .includes(technology.toLowerCase())
                        )
                );
            }
            if (jobType) {
                filteredJobs = filteredJobs.filter(
                    (job) => job.jobType.toLowerCase() === jobType.toLowerCase()
                );
            }
            if (experience) {
                filteredJobs = filteredJobs.filter(
                    (job) =>
                        job.experience.toLowerCase() ===
                        experience.toLowerCase()
                );
            }
            if (environment) {
                filteredJobs = filteredJobs.filter(
                    (job) =>
                        job.environment.toLowerCase() ===
                        environment.toLowerCase()
                );
            }
            
            console.log("Sorty By: ",sortBy)
            if (sortBy === "newest") {
                filteredJobs.sort(
                    (a, b) => new Date(b.datePosted) - new Date(a.datePosted)
                );
            } else if (sortBy === "oldest") {
                filteredJobs.sort(
                    (a, b) => new Date(a.datePosted) - new Date(b.datePosted)
                );
            }

            setJobs(filteredJobs);
            setNoMoreJobs(false);
        } catch (error) {
            console.error("Error fetching jobs:", error);
            setError("Error fetching jobs. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Simulate initial search on component mount
    useEffect(() => {
        fetchJobs(searchQuery,
            skills,
            languages,
            technologies,
            jobType,
            experience,
            environment);
    }, [sortBy]);

    // search jobs handler
    const searchJobs = async () => {
        setLoading(true);
        try {
            await fetchJobs(
                searchQuery,
                skills,
                languages,
                technologies,
                jobType,
                experience,
                environment
            ); // Call fetchJobs with the current filter values and search query
        } catch (error) {
            console.error("Error searching jobs:", error);
            setError("Error searching jobs. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    
    

    // clear filters handler
    const clearFilters = () => {
        setSearchQuery("");
        setSkills([]);
        setLanguages([]);
        setTechnologies([]);
        setJobType("");
        setExperience("");
        setEnvironment("");
        fetchJobs("", [], [], [], "", "", "");
    };

    // change handlers for user inputs
    const handleSearchQueryChange = (event) => {
        setSearchQuery(event.target.value);
    };
    const handleSkillsChange = (event, newValue) => {
        setSkills(newValue);
    };
    const handleLanguagesChange = (event, newValue) => {
        setLanguages(newValue);
    };
    const handleTechnologiesChange = (event, newValue) => {
        setTechnologies(newValue);
    };
    const handleJobTypeChange = (event, newValue) => {
        setJobType(newValue);
    };
    const handleExperienceChange = (event, newValue) => {
        setExperience(newValue);
    };
    const handleEnvironmentChange = (event, newValue) => {
        setEnvironment(newValue);
    };

    // load more jobs handler
    const loadMoreJobs = async () => {
        setLoading(true);
        // API call to load more jobs

        // Simulating API call
        setTimeout(() => {
            setLoading(false);
            // set noMoreJobs to false if there are more jobs to load (simulating)
            setNoMoreJobs(false);
        }, 2000);
    };

    return (
        <>
            <GuestNavbar currentPage="search" />
            <Stack spacing={0}>
                {/* Gray Section */}
                <Grid
                    container
                    xs={12}
                    sx={{
                        flexGrow: 1,
                        justifyContent: "center",
                        backgroundColor: "#F8F9FA",
                    }}
                >
                    <Grid
                        item
                        xs={12}
                        md={10}
                        sx={{
                            p: 6,
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        {/* Heading */}
                        <Typography level="h1" sx={{ width: "100%" }} mb={2}>
                            Search Recipes
                        </Typography>
                        {/* Subheading */}
                        <Typography level="body-md" sx={{ mb: 4 }}>
                            Browse the latest delicious recipes.
                        </Typography>

                        <Stack
                            spacing={2}
                            p={2}
                            bgcolor="white"
                            borderRadius={"12px"}
                        >
                            <Grid container spacing={1}>
                                {/* Search Bar */}
                                <Grid item xs={9}>
                                    <Input
                                        placeholder="Recipe title or difficulty..."
                                        size="lg"
                                        variant="plain"
                                        sx={{
                                            "--Input-focusedThickness": "0px",
                                            backgroundColor: "white",
                                        }}
                                        startDecorator={
                                            <img
                                                src={jobSearchIcon}
                                                alt="Search Icon"
                                                style={{ height: "26px" }}
                                            />
                                        }
                                        value={searchQuery}
                                        onChange={handleSearchQueryChange}
                                    />
                                </Grid>

                                {/* Button Group */}
                                <Grid
                                    item
                                    xs={3}
                                    container
                                    spacing={2}
                                    sx={{
                                        justifyContent: "center",
                                    }}
                                >
                                    {/* Clear Button */}
                                    <Grid item xs={12} md={6}>
                                        <Button
                                            onClick={clearFilters}
                                            variant="plain"
                                            color="neutral"
                                            fullWidth
                                            size="lg"
                                        >
                                            Clear
                                        </Button>
                                    </Grid>
                                    {/* Search Button */}
                                    <Grid item xs={12} md={6}>
                                        <Button
                                            color="primary"
                                            fullWidth
                                            size="lg"
                                            onClick={searchJobs}
                                            loading={loading}
                                        >
                                            Search
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>

                            {/* Filters */}
                            <Stack
                                spacing={0}
                                bgcolor="white"
                                borderRadius={"12px"}
                            >
                                {/* First Line of Filters */}
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={12} sm={4} md={4}>
                                        <Autocomplete
                                            placeholder="Source"
                                            multiple
                                            sx={{ backgroundColor: "white" }}
                                            limitTags={1}
                                            size="lg"
                                            options={skillOptions}
                                            onChange={handleSkillsChange}
                                            value={skills}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4} md={4}>
                                        <Autocomplete
                                            placeholder="Skills"
                                            sx={{ backgroundColor: "white" }}
                                            multiple
                                            limitTags={1}
                                            size="lg"
                                            options={languageOptions}
                                            onChange={handleLanguagesChange}
                                            value={languages}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4} md={4}>
                                        <Autocomplete
                                            placeholder="Usage"
                                            sx={{ backgroundColor: "white" }}
                                            multiple
                                            limitTags={1}
                                            size="lg"
                                            options={technologyOptions}
                                            onChange={handleTechnologiesChange}
                                            value={technologies}
                                        />
                                    </Grid>
                                </Grid>
                                {/* Second Line of Filters */}
                                <Grid
                                    container
                                    spacing={2}
                                    alignItems="center"
                                    sx={{ mt: 2 }}
                                >
                                    {/* Job Type */}
                                    <Grid item xs={12} sm={4} md={4}>
                                        <Autocomplete
                                            placeholder="Difficulty"
                                            sx={{ backgroundColor: "white" }}
                                            options={jobTypeOptions}
                                            value={jobType}
                                            size="lg"
                                            limitTags={1}
                                            onChange={handleJobTypeChange}
                                        />
                                    </Grid>
                                    {/* Experience */}
                                    <Grid item xs={12} sm={6} md={4}>
                                        <Autocomplete
                                            placeholder="Experience"
                                            options={experienceOptions}
                                            sx={{ backgroundColor: "white" }}
                                            value={experience}
                                            size="lg"
                                            limitTags={1}
                                            onChange={handleExperienceChange}
                                        />
                                    </Grid>
                                    {/* Environment */}
                                    <Grid item xs={12} sm={6} md={4}>
                                        <Autocomplete
                                            placeholder="Environment"
                                            sx={{ backgroundColor: "white" }}
                                            options={environmentOptions}
                                            value={environment}
                                            size="lg"
                                            limitTags={1}
                                            onChange={handleEnvironmentChange}
                                        />
                                    </Grid>
                                </Grid>
                            </Stack>
                        </Stack>
                    </Grid>
                </Grid>
                <Grid
                    container
                    xs={12}
                    sx={{
                        flexGrow: 1,
                        justifyContent: "center",
                        p: 8,
                    }}
                >
                    <Grid
                        item
                        xs={12}
                        md={10}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        {/* Sort Dropdown */}
                        <Grid
                            container
                            spacing={2}
                            alignItems="center"
                            sx={{ mb: 4, justifyContent: "flex-end" }} // Right align the sort dropdown
                        >
                            <Grid item xs={12} sm={6} md={4}>
                                <Select
                                    placeholder="Sort by"
                                    size="lg"
                                    sx={{ width: "100%" }}
                                    variant="outlined"
                                    startDecorator={
                                        <img
                                            src={sortIcon}
                                            alt="Sort Icon"
                                            style={{ height: "22px" }}
                                        />
                                    }
                                    value={sortBy}
                                    onChange={(e, value) => setSortBy(value)}
                                >
                                    <Option value="newest">Newest</Option>
                                    <Option value="oldest">Oldest</Option>
                                </Select>
                            </Grid>
                        </Grid>

                        {/* Job Cards */}
                        <Stack spacing={2}>
                            {jobs.map((job) => (
                                <GuestRecipeCard
                                    key={job.id}
                                    job={job}
                                    userId={userId}
                                    setBookmarkedJobs={setBookmarkedJobs}
                                    bookmarkedJobs={bookmarkedJobs}
                                    appliedJobs={appliedJobs}
                                    offeredJobs={offeredJobs}
                                />
                            ))}
                        </Stack>
                        {/* Pagination */}
                        {noMoreJobs && (
                            <Button
                                variant="soft"
                                color="primary"
                                sx={{ borderRadius: 8, mt: 6 }}
                                loading={loading}
                                onClick={loadMoreJobs}
                            >
                                Load More
                            </Button>
                        )}
                        {/* Error */}
                        {error && (
                            <Alert variant="error" sx={{ mt: 4 }}>
                                {error}
                            </Alert>
                        )}

                        {/* No Job Found */}
                        {jobs.length === 0 && !loading && (
                            <Alert
                                size="lg"
                                sx={{
                                    background: "#F9F9FB",
                                    border: "1px solid #F2F4F7",
                                }}
                            >
                                {" "}
                                Looks like there aren't any job matches for your
                                search at the moment. Please try again later
                                💼✨
                            </Alert>
                        )}
                    </Grid>
                </Grid>
            </Stack>

            <Footer />
        </>
    );
}
