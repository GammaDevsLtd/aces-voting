import { NextResponse } from "next/server";
import { connectMongoDB } from "@/libs/config/db";
import MessageModel from "@/libs/models/Messages";

export async function POST(req){
    try {
        const {fullname, message } = await req.json();
        console.log( "Fullname: ", fullname);
        console.log( "Message: ", message);

        await connectMongoDB();
        await MessageModel.create({fullname: fullname, message: message, marked: false });
        return NextResponse.json({ message: "Message Sent"}, { status: 201})
    } catch (error) {
        return NextResponse.json(
          { message: "Error while sending message", error: error.message },
          { status: 500 }
        );
    }
}

export async function GET(){
    try{
        await connectMongoDB();
        const messages = await MessageModel.find();
        return NextResponse.json({message: "All messages retrived ", messages}, {status: 201});

    }catch(error){
        return NextResponse.json(
            { message: "Error fetching Message", error: error.message},
            {status: 500}
        )
    }
}

export async function PUT(req) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { message: "Message ID is required for update" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    const existing = await MessageModel.findById(id);
    if (!existing) {
      return NextResponse.json(
        { message: "Message not found" },
        { status: 404 }
      );
    }

    // Flip it
    existing.marked = !existing.marked;
    await existing.save();

    return NextResponse.json(
      { message: "Message updated successfully", messageStatus: existing },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating message", error: error.message },
      { status: 500 }
    );
  }
}


