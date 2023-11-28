import { getCurrentUserId } from "@/helpers/getCurrentUserId";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST (request){
    try {

        const body = await request.json();
        const { id : idToDeny } = z.object({ id : z.string() }).parse(body);

        const session = await getServerSession(authOptions);
        if(!session){
            return new NextResponse("Unauthorized access", { status : 401 });

        }

        const currentUserId = await getCurrentUserId(session.user.email);

        // Removing friend request from current user set

        await db.srem(`user:${currentUserId}:incoming_friend_request`, idToDeny);

        return new NextResponse("Ok", { status:200 });

    } catch (error) {
        return new NextResponse("Internal server Error", {status : 500});
    }
}