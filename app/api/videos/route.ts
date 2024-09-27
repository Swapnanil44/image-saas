import { NextRequest, NextResponse } from "next/server";
import {  PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()
export async function GET(req:NextRequest) {
    try{
        const videos = await prisma.video.findMany({
            orderBy:{createdAt: "desc"}
        })
        return NextResponse.json(videos);
    }catch(e){
        return NextResponse.json({message: "Error while fetching the videos"},{status: 500})
    } finally{
        prisma.$disconnect()
    }
}