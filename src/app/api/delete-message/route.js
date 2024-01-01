import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { getCurrentUserId } from "@/helpers/getCurrentUserId";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

export async function PATCH ( request ) {
    try {
        const {conversationId, data} = await request.json();

        console.log(typeof data.timestamp);
        console.log(data.timestamp);

        
        const session = await getServerSession(authOptions);

        if (!session){
            return new NextResponse("Unauthorized action", { status : 401 })
        }

        const userId = await getCurrentUserId(session.user.email);

        if (userId !== data.senderId){
            return new NextResponse("Oops! Looks like you can only delete your own messages here.", { status : 401 })
        }

        const deletedMessage = {
            ...data, text : "⊘ This message was deleted"
        }

        await pusherServer.trigger(
            toPusherKey(`chat:${conversationId}:delete-message`),
            "delete_message",
            deletedMessage
        );

        await db.zrem(`chat:${conversationId}:messages`, data);

        await db.zadd(`chat:${conversationId}:messages`,
            {
                score : data.timestamp,
                member : JSON.stringify(deletedMessage)
            }
        );

        return NextResponse.json({
            success : true,
            message : "Message has been deleted"
        });

    } catch (error) {
        console.error(error);
        return new NextResponse("Internal server error", {status : 500});
    }
}
