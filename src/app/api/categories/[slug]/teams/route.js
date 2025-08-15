import { NextResponse } from "next/server";
import { connectMongoDB } from "@/libs/config/db";
import CategoryModel from "@/libs/models/CategoryModel";
import TeamModel from "@/libs/models/TeamModel";
import VoteModel from "@/libs/models/VoteModel";

export async function GET(request, context) {
  const { slug } = await context.params;

  try {
    await connectMongoDB();

    // 1. Get the category
    let category = await CategoryModel.findById(slug);
    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    // 2. Get all teams in this category
    const teams = await TeamModel.find({ categories: category._id }).lean();

    // 3. Get all votes for this category
    const votes = await VoteModel.find({ categoryId: category._id });

    // 4. Calculate total scores for each team
    const teamScores = {};
    
    votes.forEach((vote) => {
      const teamId = vote.teamId.toString();
      if (!teamScores[teamId]) {
        teamScores[teamId] = {
          totalScore: 0,
          voteCount: 0
        };
      }
      teamScores[teamId].totalScore += vote.score;
      teamScores[teamId].voteCount++;
    });

    // 5. Attach scores to teams
    const teamsWithScores = teams.map((team) => {
      const teamId = team._id.toString();
      return {
        ...team,
        totalScore: teamScores[teamId]?.totalScore || 0,
        averageScore: teamScores[teamId]
          ? teamScores[teamId].totalScore / teamScores[teamId].voteCount
          : 0
      };
    });

    return NextResponse.json(
      { 
        category: {
          ...category.toObject(),
          maxPoints: category.maxPoints
        },
        teams: teamsWithScores 
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { 
        message: "Error fetching category teams", 
        error: error.message 
      },
      { status: 500 }
    );
  }
}