import { NextResponse } from "next/server";
import { connectMongoDB } from "@/libs/config/db";
import VoteModel from "@/libs/models/VoteModel";
import { getServerSession } from "next-auth";

export async function POST(req){
try{
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email
    await connectMongoDB();

    const voteData = req.json();
    console.log(voteData)

    await VoteModel.create({userId: userEmail, teamId: voteData.teamId, categoryId: voteData.category})
    return NextResponse.json({message: "Voting Successful"}, {status: 201})
}catch(error){
    return NextResponse.json({ message: "An Error occured while casting vote" }, { status: 500 });
}
}