// ────────────────────────────
// File: server/models/Recipe.js
// ────────────────────────────
const mongoose = require("mongoose");
const { Schema } = mongoose;

const recipeSchema = new Schema(
    {
      title:       { type: String, required: true, trim: true },
      description: { type: String, default: "" },
      ingredients: { type: [String], default: [] },
      instructions:{ type: String, required: true },
      imageUrl:    { type: String, default: "" },
      postedBy:    { type: Schema.Types.ObjectId, ref: "Baker", required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.models.Recipe ?? mongoose.model("Recipe", recipeSchema);
