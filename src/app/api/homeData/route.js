import { connectMongoDB } from "@/libs/config/db";
import CategoryModel from "@/libs/models/CategoryModel";
import TeamModel from "@/libs/models/TeamModel";
import VoteModel from "@/libs/models/VoteModel";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectMongoDB();

    // Fetch categories with maxPoints
    const categories = await CategoryModel.find().lean();
    
    // Fetch teams with populated categories
    const teams = await TeamModel.find()
      .populate("categories", "name maxPoints")
      .lean();

    const votes = await VoteModel.find();

    // Create a map to store scores by team and category
    const scoresMap = {};
    votes.forEach((vote) => {
      const teamId = vote.teamId.toString();
      const categoryId = vote.categoryId.toString();
      
      if (!scoresMap[teamId]) scoresMap[teamId] = {};
      if (!scoresMap[teamId][categoryId]) {
        scoresMap[teamId][categoryId] = {
          totalScore: 0,
          voteCount: 0,
          scores: []
        };
      }
      
      scoresMap[teamId][categoryId].totalScore += vote.score;
      scoresMap[teamId][categoryId].voteCount++;
      scoresMap[teamId][categoryId].scores.push(vote.score);
    });

    // Calculate average scores
    const teamsWithScores = teams.map((team) => {
      const teamId = team._id.toString();
      const teamScores = scoresMap[teamId] || {};
      
      // Calculate overall team stats
      let totalScore = 0;
      let totalVotes = 0;
      let categoryScores = [];
      
      Object.keys(teamScores).forEach(categoryId => {
        const categoryScore = teamScores[categoryId];
        const avgScore = categoryScore.totalScore / categoryScore.voteCount;
        
        totalScore += categoryScore.totalScore;
        totalVotes += categoryScore.voteCount;
        
        categoryScores.push({
          categoryId,
          totalScore: categoryScore.totalScore,
          averageScore: avgScore,
          voteCount: categoryScore.voteCount,
          scores: categoryScore.scores
        });
      });
      
      const overallAverage = totalVotes > 0 ? totalScore / totalVotes : 0;
      
      return {
        ...team,
        id: team._id.toString(),
        totalScore,
        averageScore: parseFloat(overallAverage.toFixed(1)),
        voteCount: totalVotes,
        categoryScores
      };
    });

    // Create structured categories with teams and scores
    const structuredCategories = categories.map((category) => {
      const categoryId = category._id.toString();
      const relatedTeams = teamsWithScores.filter(team => 
        team.categories.some(cat => 
          cat._id ? cat._id.toString() === categoryId : cat.toString() === categoryId
        )
      );
      
      // Calculate category-specific stats
      const categoryTeams = relatedTeams.map(team => {
        const teamCategoryScore = team.categoryScores.find(
          score => score.categoryId === categoryId
        );
        
        return {
          id: team._id.toString(),
          name: team.name,
          totalScore: teamCategoryScore ? teamCategoryScore.totalScore : 0,
          averageScore: teamCategoryScore 
            ? parseFloat(teamCategoryScore.averageScore.toFixed(1)) 
            : 0,
          voteCount: teamCategoryScore ? teamCategoryScore.voteCount : 0
        };
      });
      
      // Sort teams by average score (descending)
      categoryTeams.sort((a, b) => b.averageScore - a.averageScore);
      
      return {
        id: categoryId,
        name: category.name,
        description: category.description,
        icon: category.icon,
        maxPoints: category.maxPoints,
        teams: categoryTeams
      };
    });

    return NextResponse.json(
      {
        categories: structuredCategories,
        teams: teamsWithScores.map(team => ({
          id: team.id,
          name: team.name,
          description: team.description,
          image: team.image,
          totalScore: team.totalScore,
          averageScore: team.averageScore,
          voteCount: team.voteCount
        })),
        stats: {
          teamCount: teams.length,
          categoryCount: categories.length,
          voteCount: votes.length,
          totalScores: teamsWithScores.reduce((sum, team) => sum + team.totalScore, 0)
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error fetching homepage data",
        error: error.message,
      },
      { status: 500 }
    );
  }
}