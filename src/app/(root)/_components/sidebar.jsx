"use client";

import { BiMessageSquareDetail } from "react-icons/bi";
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
        pusherClient.subscribe(toPusherKey(`user:${sessionId}:accept_friend_request`));

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
        pusherClient.bind('accept_friend_request', newfriendHandler);


        return () =>{
            pusherClient.unbind('new_message', chatHandler);
            pusherClient.unbind('new_friend', newfriendHandler);
            pusherClient.unbind('accept_friend_request', newfriendHandler);
            pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:chats`));
            pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`));
            pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:accept_friend_request`));
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
            <div className="w-full flex justify-between items-center text-white p-3 md:p-5">
                <h3 className="text-xl md:text-lg font-semibold">Chats</h3>
                <Link href="/" className="cursor-default md:cursor-pointer">
                    <BiMessageSquareDetail className="h-6 w-6 text-white"/>
                </Link>
            </div>
            <div className="h-full w-full overflow-y-auto">
                <nav className="flex flex-1 flex-col w-full">
                    <ul role="list" className="flex flex-1 flex-col gap-y-1 px-3 md:px-5 w-full">
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
