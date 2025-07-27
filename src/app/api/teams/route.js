// app/api/teams/route.js
import { connectMongoDB } from "@/libs/config/db";
import TeamModel from "@/libs/models/TeamModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const teamData = await req.json();
    console.log("Received team data:", teamData);

    // Validate required fields
    if (!teamData.name || !teamData.image) {
      return NextResponse.json(
        { message: "Name and image are required fields" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    // Create team with categories array
    const newTeam = await TeamModel.create({
      name: teamData.name,
      description: teamData.desc || "",
      image: teamData.image,
      categories: teamData.categories || [], // Array of category IDs
    });

    console.log("Team created successfully:", newTeam);
    return NextResponse.json(
      { message: "Team successfully created", team: newTeam },
      { status: 201 }
    );
  } catch (error) {
    console.error("Team creation error:", error);
    return NextResponse.json(
      { message: "Error creating team", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectMongoDB();

    // Fetch teams and populate category details
    const teams = await TeamModel.find().populate({
      path: "categories",
      select: "name icon description", // Only include these fields
    });

    console.log(`Fetched ${teams.length} teams`);
    return NextResponse.json(
      { message: "Teams retrieved successfully", teams },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching teams:", error);
    return NextResponse.json(
      { message: "Error fetching teams", error: error.message },
      { status: 500 }
    );
  }
}
