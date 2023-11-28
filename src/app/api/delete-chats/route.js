import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { getCurrentUserId } from "@/helpers/getCurrentUserId";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { db } from "@/lib/db";

export async function POST(req){
    try {
        const { conversationId } = await req.json();

        const session = await getServerSession(authOptions);
        if(!session){
            return new NextResponse("Unauthorized access" , {status : 401});
        }

        const currentUserId = await getCurrentUserId(session.user.email);
        if (!currentUserId){
            return new NextResponse("Unauthorized access" , {status : 401});
        }

        if(!conversationId.includes(currentUserId)){
            return new NextResponse("Unauthorized access" , {status : 401});
        }

        await db.zremrangebyrank(`chat:${conversationId}:messages`, 0, -1);

        await pusherServer.trigger(
            toPusherKey(`chat:${conversationId}:delete`),
            "delete_messages",
            {
                message : true
            }
        );

        return new NextResponse("Ok", {status : 200});
        
    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Sercer Error", {status:500});
    }
}