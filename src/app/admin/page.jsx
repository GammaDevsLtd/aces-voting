import React from "react";
import AdminPanel from "@/components/AdminPanel/AdminPanel";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";


export default async function adminPage(){

  const session = await getServerSession(authOptions);
  console.log(session);

   if (!session?.user?.isAdmin) redirect("/login");


  return(
    <div>
      <AdminPanel/>
    </div>
  )
}