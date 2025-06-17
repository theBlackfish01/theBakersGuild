// server/controllers/recipeController.js
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

/* list – public with search + pagination */
exports.list = async (req, res, next) => {
  try {
    const q = req.query.q || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const filter = q ? { $text: { $search: q } } : {};

    const [data, total] = await Promise.all([
      Recipe.find(filter)
          .sort("-createdAt")
          .skip((page - 1) * limit)
          .limit(limit)
          .populate("postedBy", "name"),
      Recipe.countDocuments(filter),
    ]);

    res.json({ data, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

/* read */
exports.read = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate("postedBy", "name");
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.json(recipe);
  } catch (err) {
    next(err);
  }
};

/* update */
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

/* remove */
exports.remove = async (req, res, next) => {
  try {
    const out = await Recipe.findOneAndDelete({ _id: req.params.id, postedBy: req.baker._id });
    if (!out) return res.status(403).json({ message: "Not allowed" });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

/* mine */
exports.mine = async (req, res, next) => {
  try {
    const list = await Recipe.find({ postedBy: req.baker._id }).sort("-createdAt");
    res.json(list);
  } catch (err) {
    next(err);
  }
};