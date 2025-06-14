/* Vercel treats every file in /api as a serverless function.
   Exporting the Express app _is_ the function. */
const app = require("../server/app");
module.exports = app;
