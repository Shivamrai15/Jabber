import { getCurrentUserId } from "@/helpers/getCurrentUserId";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST (request){
    try {

        const body = await request.json();
        const { id : idToAddFriend } = z.object({ id : z.string() }).parse(body);

        const session = await getServerSession(authOptions);
        if(!session){
            return new NextResponse("Unauthorized access", { status : 401 });

        }

        const currentUserId = await getCurrentUserId(session.user.email);
        
        // verifying both users are not friends already
        const isAlreadyFriend = await fetchRedis('sismember', `user:${currentUserId}:friends`, idToAddFriend);

        if(isAlreadyFriend){
            return new NextResponse("User is already friend", {status : 401});
        }

        // Chackeing that user has a friend request or not
        const hasFriendRequest = await fetchRedis('sismember', `user:${currentUserId}:incoming_friend_request`, idToAddFriend);

        if(!hasFriendRequest){
            return new NextResponse("User does not send friend request", {status : 401});
        }

        // Adding both users in friend set of each other
        await db.sadd(`user:${currentUserId}:friends`, idToAddFriend);
        await db.sadd(`user:${idToAddFriend}:friends`, currentUserId);

        // Removing friend request from current user set

        await db.srem(`user:${currentUserId}:incoming_friend_request`, idToAddFriend);

        await pusherServer.trigger(
            toPusherKey(`user:${idToAddFriend}:accept_friend_request`), 
            'accept_friend_request',
            {}
        );

        return new NextResponse("Ok", { status:200 });

    } catch (error) {
        console.log(error);
        return new NextResponse("Internal server Error", {status : 500});
    }
}