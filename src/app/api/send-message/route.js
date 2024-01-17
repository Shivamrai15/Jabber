import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { nanoid } from "nanoid";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST (request) {
    try {

        const {
            text,
            type,
            conversationId,
            sessionId,
            conversationFriendId,
            isEdited
        } = await request.json();

        const session = await getServerSession(authOptions);

        if(!session){
            return new NextResponse("Unauthorized access", {status:401});
        }

        const timestamp = Date.now();

        const message = {
            id : nanoid(),
            senderId : sessionId,
            text,
            type,
            timestamp,
            isEdited
        };

        await pusherServer.trigger(
            toPusherKey(`chat:${conversationId}`),
            "incoming_message",
            message
        );

        await pusherServer.trigger(
            toPusherKey(`user:${conversationFriendId}:chats`),
            'new_message',
            {
                message, 
                conversationId
            }
        );

        await db.zadd(`chat:${conversationId}:messages`, {
            score : timestamp,
            member : JSON.stringify(message)
        });

        return new NextResponse("Ok", {status : 200});

    } catch (error) {
        return new NextResponse("Internal server error", {status : 500});
    }
}