import React from 'react'
import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import { redirect } from 'next/navigation';


const AuthLayout = async({children}) => {
    const session =  await auth.api.getSession({
        headers:await headers()
    })

    if(session){
        return redirect("/")
    }
  return (
    <div>{children}</div>
  )
}

export default AuthLayout