import { connectMongoDB } from "@/libs/config/db";
import CategoryModel from "@/libs/models/CategoryModel";
import { NextResponse } from "next/server";

export async function POST(req){
    try {
        const catData = await req.json();
        console.log(catData);

        await connectMongoDB();
        await CategoryModel.create({name: catData.name, icon: catData.icon, description: catData.desc})
        return NextResponse.json({message: "Category Successfully Added"}, {status: 201});
    } catch (error) {
        return NextResponse.json({message: "Error while creating category: ", error: error.message},{status: 500})
    }
}

export async function GET(){
    try {
        await connectMongoDB();
        const category = await CategoryModel.find();
        return NextResponse.json({message: "All Categories have been retrieved: ", category},{status: 201})
    } catch (error) {
        return NextResponse.json({
            message: "Error fetching categories: ", error: error.message
        },{
            status: 500
        })
    }
}

//Alt for GET function for more controlled data sending
{
  /*
    export async function GET() {
  try {
    await connectDB();
    const categories = await CategoryModel.find({});
    
    return new Response(JSON.stringify({
      success: true,
      categories: categories.map(cat => ({
        _id: cat._id.toString(),
        name: cat.name,
        description: cat.description,
        icon: cat.icon
      }))
    }), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: "Error fetching categories: " + error.message
    }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
    */
}