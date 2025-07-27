import { connectMongoDB } from "@/libs/config/db";
import UserModel from "@/libs/models/UserModel"
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { fullname, email } = await req.json();
    await connectMongoDB();

    const existingVolunteer = await UserModel.findOne({
      fullname,
      email
    });

    return NextResponse.json({ exists: !!existingVolunteer });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error checking register existence" },
      { status: 500 }
    );
  }
}
