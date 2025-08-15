import { NextResponse } from "next/server";
import { connectMongoDB } from "@/libs/config/db";
import VoteModel from "@/libs/models/VoteModel";
import UserModel from "@/libs/models/UserModel";
import CategoryModel from "@/libs/models/CategoryModel"; // Added CategoryModel import
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email;
    await connectMongoDB();

    const voteData = await req.json(); 
    const user = await UserModel.findOne({ email: userEmail });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // NEW: Validate score against category max points
    const category = await CategoryModel.findById(voteData.category);
    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    // Validate score range
    if (
      typeof voteData.score !== "number" ||
      voteData.score < 0 ||
      voteData.score > category.maxPoints
    ) {
      return NextResponse.json(
        {
          message: `Score must be between 0 and ${category.maxPoints} for this category`,
        },
        { status: 400 }
      );
    }

    try {
      // Create vote with score
      await VoteModel.create({
        userId: user._id, 
        teamId: voteData.teamId,
        categoryId: voteData.category,
        score: voteData.score // Added score field
      });

      return NextResponse.json(
        { message: "Score submitted successfully" }, // Updated message
        { status: 201 }
      );
    } catch (error) {
      if (error.code === 11000) {
        return NextResponse.json(
          { message: "You have already scored this team in this category" }, // Updated message
          { status: 400 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error("Scoring error:", error);
    return NextResponse.json(
      { message: "An error occurred while submitting score" }, // Updated message
      { status: 500 }
    );
  }
}