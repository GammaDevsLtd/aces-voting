import mongoose, { Schema, models } from "mongoose";

const voteSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
      required: true,
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeamModel",
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CategoryModel",
      required: true,
    },
    // ADD THIS (score per category)
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 25 // Will be validated against category max
    }
  },
  { timestamps: true }
);

// MODIFIED INDEX (prevent duplicate scoring per judge-team-category)
voteSchema.index({ userId: 1, teamId: 1, categoryId: 1 }, { unique: true });

const VoteModel = models.VoteModel || mongoose.model("VoteModel", voteSchema);
export default VoteModel;
