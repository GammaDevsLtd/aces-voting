import { connectMongoDB } from "@/libs/config/db";
import CategoryModel from "@/libs/models/CategoryModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const catData = await req.json();
    
    await connectMongoDB();
    await CategoryModel.create({
      name: catData.name,
      icon: catData.icon,
      description: catData.description,
      maxPoints: catData.maxPoints // Add maxPoints
    });
    
    return NextResponse.json(
      { message: "Category Successfully Added" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error while creating category: ", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectMongoDB();
    const categories = await CategoryModel.find();
    return NextResponse.json(
      { message: "All Categories retrieved", categories },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching categories: ", error: error.message },
      { status: 500 }
    );
  }
}