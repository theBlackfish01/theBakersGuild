const jobpostDB= require("../models/jobpost")
const applicantDB = require("../models/dev")
const companyDB = require("../models/company")

const OpenAI = require("openai");
const openai = new OpenAI({
  baseURL: "tbd",
  apiKey: "tbd"
})

const generateCoverLetter = async (req, res) => {

    try {
      const { jobId, applicantId } = req.body;

        const [applicant, jobPost] = await Promise.all([
          applicantDB.findOne({userId: applicantId}),
          jobpostDB.findById(jobId)
        ]);

        if (!jobPost || !applicant) {
            return res.status(404).json({ error: 'Job post or applicant not found' });
        }

        const job_post_dict = {
          "title": jobPost.title,
          "description": jobPost.description,
          "requirement": jobPost.requirement,
          "preferredSkills": jobPost.skills,
          "preferredLanguages": jobPost.languages,
          "preferredTechnologies": jobPost.technologies,
          "experience": jobPost.experience
        };

        const job_post_details = JSON.stringify(job_post_dict);

        const applicant_dict = {
          "bio": applicant.bio,
          "skills": applicant.skills,
          "languages": applicant.languages,
          "technologies": applicant.technologies,
        };

        const applicant_details = JSON.stringify(applicant_dict);

        const prompt = `Please give a cover letter for applying to following job posting: ${job_post_details} for the applicant: ${applicant_details}. Start with: Hello, `

        const answer = await openai.chat.completions.create({
          model: "openai/gpt-3.5-turbo-0125",
          messages: [
            { role: "user", content: prompt }
          ],
        })
        const firstChoice = answer.choices[0];
        const message = firstChoice.message;
        const coverLetter = message.content;

        res.json({ coverLetter });
    } catch (error) {
        console.error('Error generating cover letter:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  };


const generateDevBio = async (req, res) => {
    try
    {
        const userId = req.body.userId;
        const developer = await applicantDB.findOne({userId: userId})

        const { country, experience, skills, languages, technologies, interestedJobType, environmentPreference } = developer;

        const skillsStr = skills.join(', ');
        const languagesStr = languages.join(', ');
        const technologiesStr = technologies.join(', ');

        const userProfile = `Country: ${country} ; Experience: ${experience} years; Skills: ${skillsStr}; Languages: ${languagesStr}; Technologies: ${technologiesStr}; interestedJobType: ${interestedJobType}; environmentPreference: ${environmentPreference}`;
        const prompt = `Give a bio to write on a freelancing platform for a user with profile : ${userProfile}`

        const answer = await openai.chat.completions.create({
            model: "openai/gpt-3.5-turbo-0125",
            messages: [
              { role: "user", content: prompt }
            ],
          })
        const firstChoice = answer.choices[0];
        const message = firstChoice.message;
        const bio = message.content;
        res.json({ bio });
    }
    catch (error)
    {
        console.error('Error generating bio', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const generateComapnyOverview = async (req, res) => {
  try
  {
      const userId = req.body.userId;

      const company = await companyDB.findOne({userId: userId})

      const { name, website, type, country, industry, size, overview, workCulture, benefits } = company;

      const companyProfile = `The company is based in Country: ${country}. Its name: ${name}. It is part of industry: ${industry}. Company type: ${type}. Number of employees: ${size}. WorkCulture: ${workCulture}. Benefits it offers to its employyes: ${benefits}`;
      const prompt = `Write a brief overview of a company using the information:- ${companyProfile}`

      const answer = await openai.chat.completions.create({
          model: "openai/gpt-3.5-turbo-0125",
          messages: [
            { role: "user", content: prompt }
          ],
        })
      const firstChoice = answer.choices[0];
      const message = firstChoice.message;
      const companyOverview = message.content;
      res.json({ companyOverview });
  }
  catch (error)
  {
      console.error('Error generating overview', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};

const generateJobDescription = async (req, res) => {
  try
  {
      const jobProfile = req.body.jobInfo;

      const prompt = `Write a job Posting description for a job using the information:- ${jobProfile}`

      const answer = await openai.chat.completions.create({
          model: "openai/gpt-3.5-turbo-0125",
          messages: [
            { role: "user", content: prompt }
          ],
        })
      const firstChoice = answer.choices[0];
      const message = firstChoice.message;
      const jobDescription = message.content;
      res.json({ jobDescription });
  }
  catch (error)
  {
      console.error('Error generating overview', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { generateCoverLetter, generateDevBio, generateComapnyOverview, generateJobDescription };