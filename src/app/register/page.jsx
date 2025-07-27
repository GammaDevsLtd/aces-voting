import React from "react"
import RegisterForm from "@/components/RegisterForm/RegisterForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function loginPage() {

    const session = await getServerSession(authOptions);
  
    if (session) redirect("/");

  return(
    <div>
      <RegisterForm/>
    </div>
  )
}