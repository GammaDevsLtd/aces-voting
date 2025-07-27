import mongoose, { Schema, models } from "mongoose";

const teamSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CategoryModel",
      },
    ],
  },
  { timestamps: true }
);

const TeamModel = models.TeamModel || mongoose.model("TeamModel", teamSchema);
export default TeamModel;
