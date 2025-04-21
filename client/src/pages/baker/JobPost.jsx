import React, { useState } from "react";
import { Typography, Stack, Grid, Button } from "@mui/joy";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
// // // // import { CalendarToday, PeopleAltSharp, CodeOff, Code } from "@mui/icons-material";
import CompanyNavbar from "../../components/CompanyNavbar";
import ApplicantCard from "../../components/ApplicantCard";
import Footer from "../../components/Footer";

const JobPostPage = () => {
  // Sample job data
  const job = {
    title: "Full Stack Developer",
    datePosted: "March 30, 2024",
    status: "Closed",
    numApplicants: 3,
    description:
      "Seeking a Machine Learning Engineer to develop and implement ML models to solve complex problems and drive growth. Collaborate with cross-functional teams to design scalable solutions and deploy models into production.\n \n Responsibilities include : \n \n Develop and deploy ML models. \n  Collaborate with teams. \n Optimize models for performance. \n  Stay updated with ML advancements. \n \n  Apply now and be part of our journey!",
    requirements: "-> Banda Mehanti ho \n -> Chill Mode\n \n جیتے رہو",
  };

  const applicants = [
    {
      name: "John Doe",
      qualification: "Passed",
      experience: "5+ Years",
      skills: "5/5",
      status: "undecided",
    },
    {
      name: "Haskell",
      qualification: "Failed",
      experience: "2+ Years",
      skills: "2/5",
      status: "rejected",
    },
    {
      name: "Guy",
      qualification: "Passed",
      experience: "10+ Years",
      skills: "5/5",
      status: "shortlisted",
    },
  ];
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (index) => {
    setTabIndex(index);
  };

  return (
    <>
      <CompanyNavbar currentPage="JobPost" />
      {/* This paragraph is for spacing, other methods were not working */}
      <p> </p>
      <Grid container justifyContent="center">
        <Grid xs={12} md={8} lg={6}>
          <Stack
            spacing={3}
            border={1}
            borderRadius={4}
            borderColor="#E1E5EA"
            padding={3}
          >
            {/* Job Title */}
            <Stack spacing={2}>
              <Typography
                textAlign={"left"}
                variant="h1"
                fontSize={30}
                color="#101828"
                fontWeight={550}
              >
                {job.title}
              </Typography>
              {/* Key Info below title */}
              {/* Border Left is just so we have correct alignment */}
              <Stack
                direction="row"
                spacing={1}
                borderLeft={8}
                borderColor="#FFFFFF"
              >
                {/* <CalendarToday /> */}
                <Typography variant="body2" fontSize={12} textColor={475467}>
                  {" "}
                  {job.datePosted}
                </Typography>
                {/* {job.status === 'Open' ? <Code /> : <CodeOff />} */}
                <Typography variant="body2" fontSize={12} textColor={475467}>
                  {" "}
                  {job.status}
                </Typography>
                {/* <PeopleAltSharp /> */}
                <Typography variant="body2" fontSize={12} textColor={475467}>
                  {" "}
                  {job.numApplicants}
                </Typography>
              </Stack>
            </Stack>
            {/*Description and Requirements*/}
            <Stack spacing={2}>
              <Typography
                textAlign={"left"}
                fontSize={20}
                variant="h1"
                color="#101828"
                fontWeight={550}
              >
                Description
              </Typography>
              <Typography variant="body-lg" color="neutral" textColor={475467}>
                {job.description.split("\n").map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </Typography>

              <Typography
                textAlign={"left"}
                fontSize={20}
                variant="h1"
                color="#101828"
                fontWeight={550}
              >
                Requirements
              </Typography>
              <Typography variant="body-lg" color="neutral" textColor={475467}>
                {job.requirements.split("\n").map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </Typography>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
      <p></p>

      {/* <Stack spacing={2} marginLeft={-35}>
            {applicants.map((applicant, index) => (
                <ApplicantCard key={index} applicant={applicant} />
              ))}
        </Stack> */}
      <Grid container justifyContent="center">
        <Stack
          direction="row"
          spacing={1}
          p={1.2}
          bgcolor={"#F9F9FB"}
          sx={{
            width: "fit-content",
            borderRadius: 8,
            border: "1px solid #F2F4F7",
          }}
        >
          <Button
            variant={tabIndex === 0 ? "outlined" : "plain"}
            color="neutral"
            size="large"
            sx={{ borderRadius: 6, bgcolor: tabIndex === 0 ? "white" : "" }}
            onClick={() => handleTabChange(0)}
          >
            All Applicants
          </Button>
          <Button
            variant={tabIndex === 1 ? "outlined" : "plain"}
            color="neutral"
            size="large"
            sx={{ borderRadius: 6, bgcolor: tabIndex === 1 ? "white" : "" }}
            onClick={() => handleTabChange(1)}
          >
            Shortlisted
          </Button>
          <Button
            variant={tabIndex === 2 ? "outlined" : "plain"}
            color="neutral"
            size="large"
            sx={{ borderRadius: 6, bgcolor: tabIndex === 2 ? "white" : "" }}
            onClick={() => handleTabChange(2)}
          >
            Rejected
          </Button>
        </Stack>
      </Grid>
      <p></p>

      <Grid container justifyContent="center">
        {tabIndex === 0 && (
          <Stack spacing={2}>
            {applicants.map((applicant, index) => (
              <ApplicantCard key={index} applicant={applicant} />
            ))}
          </Stack>
        )}
        {tabIndex === 1 && (
          <Stack spacing={2}>
            {applicants
              .filter((applicant) => applicant.status === "shortlisted")
              .map((applicant, index) => (
                <ApplicantCard key={index} applicant={applicant} />
              ))}
          </Stack>
        )}
        {tabIndex === 2 && (
          <Stack spacing={2}>
            {applicants
              .filter((applicant) => applicant.status === "rejected")
              .map((applicant, index) => (
                <ApplicantCard key={index} applicant={applicant} />
              ))}
          </Stack>
        )}
      </Grid>

      <p></p>
      <Footer />
    </>
  );
};

export default JobPostPage;
