// ────────────────────────────
// File: server/index.js  (local dev only)
// ────────────────────────────
const app  = require("./app");
const port = process.env.PORT || 8000;

app.listen(port, () =>
    console.log(`🚀  Baker’s Guild API listening on :${port}`)
);
