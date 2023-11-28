"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
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
            <div className="grid grid-cols-3 gap-x-1 px-4 mt-auto mb-4 place-items-center md:hidden">
                <Link
                    href="/notifications"
                    className="flex justify-center px-4 py-2 rounded-md items-center bg-neutral-800 cursor-default w-full"
                >
                    <Bell className="h-5 w-5 text-white"/>
                </Link>
                <Link
                    href="/add"
                    className="flex justify-center px-4 py-2 rounded-md items-center bg-neutral-800 cursor-default w-full"
                >
                    <UserSquare className="h-5 w-5 text-white"/>
                </Link>
                <div
                    className="flex justify-center px-4 py-2 rounded-md items-center bg-neutral-800 cursor-default w-full"
                >
                    <Settings user = {session?.user}/>
                </div>

            </div>
            <div className="hidden md:flex md:flex-col gap-y-2 px-5 mt-auto mb-5">
                    <Link
                        href="/notifications"
                        className="flex justify-between px-4 py-2 rounded-md items-center bg-neutral-800 hover:bg-neutral-800/50"
                    >
                        <Bell className="h-6 w-6 text-white"/>
                        <div className="text-zinc-300 text-sm flex items-center">
                            Notifications
                            {unseenNotificationCount > 0 && (
                                <Badge className="bg-green-600 ml-2">
                                    {unseenNotificationCount}
                                </Badge>
                            )}
                        </div>
                    </Link>
                    <Link
                        href="/add"
                        className="flex justify-between px-4 py-2 rounded-md items-center bg-neutral-800 hover:bg-neutral-800/50"
                    >
                        <UserSquare className="h-6 w-6 text-white"/>
                        <span className="text-zinc-300 text-sm">
                            Add friend
                        </span>
                    </Link>
                    <div
                        className="flex justify-between px-4 py-2 rounded-md items-center bg-neutral-800 hover:bg-neutral-800/50"
                    >
                        <Avatar className = "h-6 w-6">
                            <AvatarImage
                                src = {session?.user?.image}
                            />
                        </Avatar>
                        <div className="flex items-center gap-x-4">
                            <p className="text-sm font-semibold text-zinc-300">{session?.user?.name}</p>
                            <Settings user = {session?.user}/>
                        </div>
                    </div>
            </div>
        </>
    )
}

export default SidebarFooter