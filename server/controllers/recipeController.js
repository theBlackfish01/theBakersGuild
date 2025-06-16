// ────────────────────────────
// File: server/controllers/recipeController.js
// ────────────────────────────
const Recipe = require("../models/Recipe");

/* create */
exports.create = async (req, res, next) => {
  try {
    const recipe = await Recipe.create({ ...req.body, postedBy: req.baker._id });
    res.status(201).json(recipe);
  } catch (err) {
    next(err);
  }
};

/* list public */
exports.list = async (_req, res, next) => {
  try {
    const recipes = await Recipe.find().populate("postedBy", "name");
    res.json(recipes);
  } catch (err) {
    next(err);
  }
};

/* read single */
exports.read = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate("postedBy", "name");
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.json(recipe);
  } catch (err) {
    next(err);
  }
};

/* update (only owner) */
exports.update = async (req, res, next) => {
  try {
    const recipe = await Recipe.findOneAndUpdate(
        { _id: req.params.id, postedBy: req.baker._id },
        req.body,
        { new: true }
    );
    if (!recipe) return res.status(403).json({ message: "Not allowed" });
    res.json(recipe);
  } catch (err) {
    next(err);
  }
};

/* delete (only owner) */
exports.remove = async (req, res, next) => {
  try {
    const out = await Recipe.findOneAndDelete({
      _id: req.params.id,
      postedBy: req.baker._id,
    });
    if (!out) return res.status(403).json({ message: "Not allowed" });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

exports.mine = async (req, res, next) => {
  try {
    const list = await Recipe.find({ postedBy: req.baker._id })
        .sort("-createdAt");
    res.json(list);
  } catch (err) {
    next(err);
  }
};