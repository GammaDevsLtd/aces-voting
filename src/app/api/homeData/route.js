import { connectMongoDB } from "@/libs/config/db";
import CategoryModel from "@/libs/models/CategoryModel";
import TeamModel from "@/libs/models/TeamModel";
import VoteModel from "@/libs/models/VoteModel";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectMongoDB();

    const categories = await CategoryModel.find().lean();
    const teams = await TeamModel.find().lean();

    const votes = await VoteModel.find();

    // Count votes for each team
    const voteCounts = {};
    votes.forEach((vote) => {
      const teamId = vote.teamId.toString();
      voteCounts[teamId] = (voteCounts[teamId] || 0) + 1;
    });

    // Add vote counts to teams
    const teamsWithVotes = teams.map((team) => ({
      ...team,
      votes: voteCounts[team._id.toString()] || 0,
    }));

    return NextResponse.json(
      {
        categories,
        teams: teamsWithVotes,
        stats: {
          teamCount: teams.length,
          categoryCount: categories.length,
          voteCount: votes.length,
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
