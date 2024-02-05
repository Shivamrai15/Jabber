"use client";

import { useEffect, useState } from "react";
import { RequestMessage } from "./request-message";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { useNotification } from "@/hooks/use-notifications";
import { BellRing } from "lucide-react";

export const FriendRequests = ({incomingFriendRequests, sessionId}) => {

    const router = useRouter();
    const [friendRequests, setFriendRequests] = useState(incomingFriendRequests);

    const {unseenNotificationCount, setUnseenNotificationCount} = useNotification();

    useEffect(()=>{
        pusherClient.subscribe(
            toPusherKey(`user:${sessionId}:incoming_friend_request`)
        );

        const friendRequestsHandler = ({...data}) =>{
            setFriendRequests((prev)=>[...prev, {...data}])
        }

        pusherClient.bind(
            "incoming_friend_request",
            friendRequestsHandler
        );

        return () => {
            pusherClient.unsubscribe(
                toPusherKey(`user:${sessionId}:incoming_friend_request`)
            );
            pusherClient.unbind(
                "incoming_friend_request",
                friendRequestsHandler
            );
    
        }
    }, []);

    const acceptRequest = async(senderId)=>{
        try {
            await axios.post("/api/accept-request", {
                id : senderId
            });
            setFriendRequests((prev) => prev.filter((request) => request.id !== senderId));
            setUnseenNotificationCount(unseenNotificationCount-1);
            router.refresh();
        } catch (error) {
            console.error(error);
            // toast.error("Something went wrong!");
        } 
    }

    const denyRequest = async(senderId)=>{
        try {
            await axios.post("/api/deny-request", {
                id : senderId
            });
            setFriendRequests((prev) => prev.filter((request) => request.id !== senderId));
            setUnseenNotificationCount(unseenNotificationCount-1);
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong!");
        } 
    }

    return (
        <>
            {friendRequests.length === 0 ? (
                <div className="flex flex-1 flex-col justify-center items-center mt-20 gap-y-5">
                    <BellRing
                        className="text-zinc-300 h-12 w-12"
                    />
                    <div className="text-zinc-300 cursor-default font-semibold text-center">
                        Nothing to show here...
                    </div>
                </div>
            ) : (
                <div className="mt-10 flex flex-col gap-y-4">
                    {friendRequests.map((request)=>(
                        <RequestMessage
                            key = {request.id}
                            data = {request}
                            acceptRequest = {acceptRequest}
                            denyRequest = {denyRequest}
                        />
                    ))}
                </div>
            )}
        </>
    );
}

