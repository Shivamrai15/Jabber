"use client";

import { useSession } from "next-auth/react";
import { Settings } from "./settings";
import { Bell, UserSquare } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { useNotification } from "@/hooks/use-notifications";

const SidebarFooter = ({
    initialUnseenRequestCount,
    sessionId
}) => {

    const { data: session } = useSession();

    const {unseenNotificationCount, setUnseenNotificationCount} = useNotification();

    useEffect(()=>{
        pusherClient.subscribe(
            toPusherKey(`user:${sessionId}:incoming_friend_request`)
        );

        const friendRequestsHandler = () =>{
            setUnseenNotificationCount(unseenNotificationCount+1);
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

    return (
        <>
            <div className="grid grid-cols-3 gap-x-1 px-3 md:px-5 mt-auto mb-4 place-items-center">
                <Link
                    href="/notifications"
                    className="flex justify-center px-4 py-2 rounded-md items-center bg-neutral-800 cursor-default w-full md:cursor-pointer"
                >
                    <div className="w-fit h-fit flex justify-center items-center">
                        <Bell className="h-5 w-5 text-white"/>
                        {unseenNotificationCount > 0 && (
                                <Badge className="bg-green-600 ml-2">
                                    {unseenNotificationCount}
                                </Badge>
                        )}
                    </div>

                </Link>
                <Link
                    href="/add"
                    className="flex justify-center px-4 py-2 rounded-md items-center bg-neutral-800 cursor-default w-full md:cursor-pointer"
                >
                    <UserSquare className="h-5 w-5 text-white"/>
                </Link>
                <div
                    className="flex justify-center px-4 py-2 rounded-md items-center bg-neutral-800 cursor-default w-full"
                >
                    <Settings user = {session?.user}/>
                </div>

            </div>
        </>
    )
}

export default SidebarFooter