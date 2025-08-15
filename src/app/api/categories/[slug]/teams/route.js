import { NextResponse } from "next/server";
import { connectMongoDB } from "@/libs/config/db";
import CategoryModel from "@/libs/models/CategoryModel";
import TeamModel from "@/libs/models/TeamModel";
import VoteModel from "@/libs/models/VoteModel";

export async function GET(request, context) {
  const { slug } = await context.params;

  try {
    await connectMongoDB();

    // 1. Get the category with maxPoints
    const category = await CategoryModel.findById(slug);
    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    // 2. Get all teams in this category
    const teams = await TeamModel.find({ categories: category._id })
      .populate('categories', 'name maxPoints')
      .lean();

    // 3. Get all votes for this category
    const votes = await VoteModel.find({ categoryId: category._id });

    // 4. Calculate scores for each team
    const teamScores = {};
    
    votes.forEach((vote) => {
      const teamId = vote.teamId.toString();
      if (!teamScores[teamId]) {
        teamScores[teamId] = {
          totalScore: 0,
          voteCount: 0,
          scores: []
        };
      }
      teamScores[teamId].totalScore += vote.score;
      teamScores[teamId].voteCount++;
      teamScores[teamId].scores.push(vote.score);
    });

    // 5. Attach scores to teams
    const teamsWithScores = teams.map((team) => {
      const teamId = team._id.toString();
      const scoreData = teamScores[teamId] || {
        totalScore: 0,
        voteCount: 0,
        scores: []
      };
      
      return {
        ...team,
        id: team._id.toString(),
        totalScore: scoreData.totalScore,
        voteCount: scoreData.voteCount,
        scores: scoreData.scores,
        averageScore: scoreData.voteCount > 0 
          ? scoreData.totalScore / scoreData.voteCount 
          : 0
      };
    });

    // 6. Sort teams by average score (descending)
    teamsWithScores.sort((a, b) => b.averageScore - a.averageScore);

    return NextResponse.json(
      { 
        category: {
          id: category._id.toString(),
          name: category.name,
          description: category.description,
          icon: category.icon,
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