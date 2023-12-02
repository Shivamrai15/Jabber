"use client";

import { MessageCircleIcon } from "lucide-react";
import Link from "next/link";
import SidebarFooter from "./sidebar-footer";
import { ChatBox } from "./chat-box";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { conversationIdGenerator, toPusherKey } from "@/lib/utils";
import { pusherClient } from "@/lib/pusher";

export const Sidebar = ({
    initialUnseenRequestCount,
    sessionId,
    friends
}) => {

    const router = useRouter();
    const pathname = usePathname(); 

    const [unseenMessages, setUnseenMessages] = useState([]);

    useEffect(()=>{
        pusherClient.subscribe(toPusherKey(`user:${sessionId}:chats`));
        pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`));

        const newfriendHandler = ()=>{
            router.refresh();
        }

        const chatHandler = (message) => {
            const shouldNotify = pathname !== `/conversation/${conversationIdGenerator(sessionId, message.senderId)}`;
            if(!shouldNotify){
                return;
            }
            setUnseenMessages((prev)=>[...prev, message]);
        }

        pusherClient.bind('new_message', chatHandler);
        pusherClient.bind('new_friend', newfriendHandler);


        return () =>{
            pusherClient.unbind('new_message', chatHandler);
            pusherClient.unbind('new_friend', newfriendHandler);
            pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:chats`));
            pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`));
        }
    }, [pathname]);



    useEffect(()=>{
        if(pathname?.includes('conversation')){
            setUnseenMessages((prev)=>{
                return prev.filter((message)=> !pathname.includes(message.senderId));
            });
        }
    }, [pathname]);

    return (
        <div className="w-full h-full flex flex-col gap-y-5">
            <div className="w-full flex justify-between items-center text-white p-5">
                <h3 className="text-lg font-semibold">Chats</h3>
                <Link href="/">
                    <MessageCircleIcon className="h-5 w-5"/>
                </Link>
            </div>
            <div className="h-full w-full overflow-y-auto">
                <nav className="flex flex-1 flex-col w-full">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7 px-5 w-full">
                        {friends.sort().map((friend)=>{
                            const unseenMessagesCount = unseenMessages.filter((unseenMessage)=>{
                                return unseenMessage.senderId === friend.id;
                            }).length
                            return <ChatBox
                                key={friend.id}
                                data = {friend}
                                pathname = {pathname}
                                unseenMessagesCount = {unseenMessagesCount}
                                href={`/conversation/${conversationIdGenerator(sessionId, friend.id)}`}
                            />
                        })}
                    </ul>
                </nav>
            </div>
            <SidebarFooter
                sessionId = {sessionId}
                initialUnseenRequestCount = {initialUnseenRequestCount}
            />
        </div>
    );
}
