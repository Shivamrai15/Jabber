import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { fetchRedis } from "@/helpers/redis";
import { getCurrentUserId } from "@/helpers/getCurrentUserId";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

export async function POST (request) {
    try {
        const {email : emailToAdd} = await request.json();

        const session = await getServerSession(authOptions);

        if(!session){
            return new NextResponse("Unauthorized access" , {status : 401});
        }

        if (emailToAdd === session.user.email){
            return new NextResponse("You cannot add yourself as a friend" , {status : 400});
        }
        

        // Fetching Id of the user to be added as a friend
        const restResponse = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/get/user:email:${emailToAdd}`, {
            headers : {
                Authorization : `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
            },
            cache : "no-store"
        });

        const data = await restResponse.json();

        const idToAdded = data.result;

        if(!data){
            return new NextResponse("User does not exist" , {status : 404});
        }
        

        // valid request

        // Fetching Current User Id

        const currentUserId = await getCurrentUserId(session.user.email);

        const isAlreadyAdded = await fetchRedis('sismember', `user:${idToAdded}:incoming_friend_request`, currentUserId);

        if(isAlreadyAdded){
            return new NextResponse("User has been already added", {status : 400});
        }

        const isAlreadyFriend = await fetchRedis('sismember', `user:${currentUserId}:friends`, idToAdded);

        if(isAlreadyFriend){
            return new NextResponse("User is already friend", {status : 400});
        }

        // send valid freind request

        pusherServer.trigger(
            toPusherKey(`user:${idToAdded}:incoming_friend_request`), 
            'incoming_friend_request',
            {
                id : currentUserId,
                email : session.user.email,
                image : session.user.image,
                name : session.user.name
            }
        );

        db.sadd(`user:${idToAdded}:incoming_friend_request`, currentUserId);

        return NextResponse.json({
            success : true,
            message : "Friend request is sent"
        });
        
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal server error", {status : 500});
    }
}