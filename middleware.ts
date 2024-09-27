import { auth, clerkMiddleware, createRouteMatcher,  } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/',
    '/home'
])

const isPublicApiRoute = createRouteMatcher([
    '/api/videos'
])
export default clerkMiddleware((auth,req)=>{
    const {userId} = auth();
    const currentUrl = new URL(req.url)
    const isAccessingDashBoard = currentUrl.pathname === "/home";
    const isApiRequest = currentUrl.pathname.startsWith("/api");

    //if the user id logged in and trying to acess the public routes othe than home
    if(userId && isPublicRoute(req) && !isAccessingDashBoard){
        return NextResponse.redirect(new URL("/home",req.url))
    }
    //if the user id not logged in
    if(!userId){
        //if the user is not logged in and trying to acess the protected routes
        if(!isPublicRoute(req) && !isPublicApiRoute(req)){
            return NextResponse.redirect(new URL("/sign-in",req.url));
        }
        //if the user is not logged in and trying to acess the protected api routes
        if(isApiRequest && !isPublicApiRoute(req)){
            return NextResponse.redirect(new URL("/sign-in",req.url))
        }
    }

    return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};