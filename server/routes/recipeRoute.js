// ────────────────────────────
// File: server/routes/recipeRoute.js
// ────────────────────────────
const router = require("express").Router();
const C      = require("../controllers/recipeController");
const guard  = require("../middlewares/auth");

/* public */
router.get("/",       C.list);
router.get("/:id",    C.read);

/* baker-only */
router.get("/mine",   guard, C.mine);          //  ← NEW
router.post("/",      guard, C.create);
router.patch("/:id",  guard, C.update);
router.delete("/:id", guard, C.remove);

module.exports = router