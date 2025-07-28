import { NextResponse } from "next/server";
import { connectMongoDB } from "@/libs/config/db";
import VoteModel from "@/libs/models/VoteModel";
import UserModel from "@/libs/models/UserModel";
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

    try {
      await VoteModel.create({
        userId: user._id, 
        teamId: voteData.teamId,
        categoryId: voteData.category,
      });

      return NextResponse.json({ message: "Vote successful" }, { status: 201 });
    } catch (error) {
      if (error.code === 11000) {
        // Duplicate vote
        return NextResponse.json(
          { message: "You have already voted in this category" },
          { status: 400 }
        );
      }

      throw error;
    }
  } catch (error) {
    console.error("Voting error:", error);
    return NextResponse.json(
      { message: "An error occurred while casting vote" },
      { status: 500 }
    );
  }
}
