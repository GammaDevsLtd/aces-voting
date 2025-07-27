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
  },
  { timestamps: true }
);

// Prevent a user from voting more than once per category
voteSchema.index({ userId: 1, categoryId: 1 }, { unique: true });

const VoteModel = models.VoteModel || mongoose.model("VoteModel", voteSchema);
export default VoteModel;
