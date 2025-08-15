import mongoose, { Schema, models } from "mongoose";

const categorySchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    icon: { 
      type: String,
      required: true,
      default: "Monitor" 
    },
    // ADD THIS
    maxPoints: {
      type: Number,
      required: true,
      default: 25
    }
  },
  { timestamps: true }
);

const CategoryModel =
  models.CategoryModel || mongoose.model("CategoryModel", categorySchema);
export default CategoryModel;
