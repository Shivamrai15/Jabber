import { authOptions } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST (req){
    try {

        const {
            conversationId,
            conversationFriendId,
            isTyping,
        }  = await req.json();

        const session = await getServerSession(authOptions);
        if(!session){
            return new NextResponse("Unauthorized access", {status:401});
        }

        pusherServer.trigger(
            toPusherKey(`chat:${conversationId}:typing`),
            "typing_message",
            {
                isTyping,
                conversationFriendId
            }
        );

        return new NextResponse("Ok", {status : 200}); 

    } catch (error) {
        console.error(error);
        return new NextResponse("Internal server error", {status : 500});
    }
    
}