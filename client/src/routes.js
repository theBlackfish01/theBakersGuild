import JobPost from "./pages/baker/BakerIndividualJob.jsx";

const apiRoutes = {
  // User Routes
  user: {
    register: "/user/register",
    login: "/user/login",
    getUser: "/user/getUser",
    changePassword: "/user/changePassword",
    delete: "/user/deleteUser"
  },

  // Job Routes
  job: {
    create: "/job/create",
    getAll: "/job/all",
    getRelatedJobs: "/job/related",
    getAllApplicants: "/job/allApplicants",
    edit: "/job/edit",
    close: "/job/close",
    delete: "/job/delete",
    deleteApplicant: "/job/deleteApplicant",
    updateBookmarks: "/job/updateBookmarks",
    individualBookmarks:"/job/individualBookmarks",
    acceptOffer:"/job/acceptOffer",
    rejectOffer: "/job/rejectOffer",
    getJobApplicants: "/job/getJobApplicants",
    sendJobOffer:"/job/sendJobOffer",
    updateToggleStatus:"/job/toggleStatus"
  },

  // Developer Routes
  dev: {
    register: "/novice/profileSetup",
    edit: "/novice/profileEdit",
    application: "/novice/application",
    getProfile: "/novice/getProfile",
    delete: "/novice/deleteDev"
  },

  // Company Routes
  company: {
    register: "/baker/profileSetup",
    edit: "/baker/profileEdit",
    getMyJobs: (userId) => `/company/myJobs/${userId}`,
    updateBookmark: "/baker/bookmark",
    getProfile: "/baker/getProfile",
    delete: "/baker/deleteCompany",
    getApplicants: "/baker/getApplicants",
  },
};

// Client-Side Navigation (React Router Routes)
const clientRoutes = {
  signup: "/",
  login: "/login",
  companyProfileSetup: "/baker/profileSetup",
  devProfileSetup: "/novice/profileSetup",
  companyDashboard: "/baker/dashboard",
  devDashboard: "/novice/dashboard",
  postAJob: "/postAJob",
  searchJobs: "/novice/search",
  devSettings: "/novice/settings",
  companySettings: "/baker/settings",
  devIndividualJob: "/novice/job",
  companyIndividualJob:"/baker/job"
};

export { apiRoutes, clientRoutes };