import { NextResponse } from "next/server";
import { connectMongoDB } from "@/libs/config/db";
import CategoryModel from "@/libs/models/CategoryModel";
import TeamModel from "@/libs/models/TeamModel";
import VoteModel from "@/libs/models/VoteModel";

export async function GET(request, context) {
  const { slug } = await context.params;

  try {
    await connectMongoDB();

    // 1. Get the category (by id)
    let category = await CategoryModel.findById(slug);

    if (!category) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 });
    }

    // 2. Get all teams in this category
    const teams = await TeamModel.find({ categories: category._id }).lean(); // .lean() makes it a plain object

    // 3. Get all votes for this category
    const votes = await VoteModel.find({ categoryId: category._id });

    // 4. Count how many votes each team has
    const voteCounts = {};
    votes.forEach((vote) => {
      const teamId = vote.teamId.toString();
      voteCounts[teamId] = (voteCounts[teamId] || 0) + 1;
    });

    // 5. Attach vote count to each team
    const teamsWithVotes = teams.map((team) => ({
      ...team,
      votes: voteCounts[team._id.toString()] || 0,
    }));

    return NextResponse.json(
      { category, teams: teamsWithVotes },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching category teams", error: error.message },
      { status: 500 }
    );
  }
}
