import { headers } from "next/headers"
import { auth } from "./auth"
import { redirect } from "next/navigation";

export const requireauth=async()=>{
    const session=await auth.api.getSession({
        headers:await headers()
    });
    if(!session){
        redirect("/signup")
    };
    return session;
}
export const requireunauth=async()=>{
    const session=await auth.api.getSession({
        headers:await headers()
    });
    if(session){
        redirect("/dashboard")
    };
    return session;
}