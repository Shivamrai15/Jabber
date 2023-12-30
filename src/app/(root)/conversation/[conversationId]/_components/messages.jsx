"use client";
import { useEffect, useRef, useState} from "react";
import { MessageBox } from "./message-box";
import { pusherClient } from "@/lib/pusher";
import { cn, toPusherKey } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useLastMessage } from "@/hooks/use-last-message";

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";

import {
    Copy,
    Trash2,
    Pencil,
    Forward,
    Atom
}  from "lucide-react";

export const revalidate = 0;

export const Messages = ({initialMessages , sessionId, chatId}) => {

    const router = useRouter();
    const pathname = usePathname();
    const scrollRef = useRef(null);
    const [messages, setMessages] = useState(initialMessages);
    const [isTyping, setIsTyping] = useState(false);
    const { setLastMessages } = useLastMessage()

    useEffect(()=>{
        scrollRef?.current?.scrollIntoView();
    }, [messages, isTyping]);

    useEffect(()=>{
        pusherClient.subscribe(
            toPusherKey(`chat:${chatId}`)
        );

        pusherClient.subscribe(
            toPusherKey(`chat:${chatId}:delete`)
        );

        pusherClient.subscribe(
            toPusherKey(`chat:${chatId}:typing`)
        )

        const messageHandler = (message) =>{
            setIsTyping(false);
            setMessages((prev)=>[...prev, message]);
            setLastMessages(message, chatId);
        }

        const deleteMessages = ()=>{
            setMessages([]);
            setLastMessages('', chatId);
        }

        const typingStatus = ({
            isTyping,
            conversationFriendId
        }) => {
            if (conversationFriendId === sessionId && isTyping === true){
                setIsTyping(true);
            } else {
                setIsTyping(false);
            }
        }

        pusherClient.bind(
            "incoming_message",
            messageHandler
        );

        pusherClient.bind(
            "delete_messages",
            deleteMessages
        );

        pusherClient.bind(
            "typing_message",
            typingStatus
        );

        return () => {
            pusherClient.unsubscribe(
                toPusherKey(`chat:${chatId}`)
            );
            pusherClient.unsubscribe(
                toPusherKey(`chat:${chatId}:delete`)
            );
            pusherClient.unsubscribe(
                toPusherKey(`chat:${chatId}:typing`)
            )
            pusherClient.unbind(
                "incoming_message",
                messageHandler
            );
            pusherClient.unbind(
                "delete_messages",
                deleteMessages
            );
            pusherClient.unbind(
                "typing_message",
                typingStatus
            );
    
        }
    }, [messages, isTyping]);

    useEffect(()=>{
        router.refresh();
    }, [pathname]);


    const copyMessage = (message) => {
        navigator.clipboard.writeText(message);
    }

    // if (!isTyping && messages?.length === 0){
    //     return (
    //         <div className="w-full h-[calc(100%-160px)] flex justify-center items-center">
    //             <div  className="max-w-sm w-72 relative bg-black bg-opacity-40 flex flex-col justify-center items-center rounded-xl p-4 cursor-default">
    //                 💀 Chat's dead, hit me up. 💯
    //             </div>
    //         </div>
    //     );
    // }

    return (
        <div className={cn(
            "w-full h-[calc(100%-160px)] flex-1 flex-col-reverse gap-4 py-5 px-5 md:px-8 lg:px-14 overflow-y-auto message-scroll",
            messages.length === 0 && !isTyping && "flex justify-center items-center"
        )}>
            {messages.map((message, index)=>{
                const isCurrentUser = message.senderId === sessionId;
                const hasNextMessageFromSameUser = messages?.[index+1]?.senderId === messages?.[index]?.senderId
                return <ContextMenu>
                    <ContextMenuTrigger>
                        <MessageBox
                            key = {`${message.id}-${message.timestamp}`}
                            data = {message}
                            isCurrentUser = {isCurrentUser}
                            hasNextMessageFromSameUser = {hasNextMessageFromSameUser}
                        />
                    </ContextMenuTrigger>
                    <ContextMenuContent align = "top" className = "w-52 bg-neutral-900">
                        {
                            message.type === "text" && 
                            <ContextMenuItem
                                onClick = {()=>copyMessage(message.text)}
                            >
                                <Copy className="h-5 w-5 ml-1 mr-4"/>
                                Copy
                            </ContextMenuItem>
                        }
                        <ContextMenuItem>
                            <Forward className="h-5 w-5 ml-1 mr-4"/>
                            Forward
                        </ContextMenuItem>
                        {
                            isCurrentUser && 
                            <ContextMenuItem>
                                <Trash2 className="h-5 w-5 ml-1 mr-4"/>
                                Delete
                            </ContextMenuItem>
                        }
                        {
                            isCurrentUser && message.type === "text" &&
                            <ContextMenuItem>
                                <Pencil className="h-5 w-5 ml-1 mr-4"/>
                                Edit
                            </ContextMenuItem>
                        }
                        {
                            !isCurrentUser && message.type === "text" &&
                            <ContextMenuItem>
                                <Atom className="h-5 w-5 ml-1 mr-4"/>
                                Ask AI
                            </ContextMenuItem>
                        }
                    </ContextMenuContent>
                </ContextMenu>
            })}
            {
                isTyping && (
                    <div className="w-16 h-9 mx-3 mt-3 bg-neutral-500 rounded-full flex justify-center items-center gap-x-1">
                        <div className="bg-white h-3 w-3 rounded-full animate-bounce"/>
                        <div className="bg-white h-3 w-3 rounded-full animate-bounce delay-150"/>
                        <div className="bg-white h-3 w-3 rounded-full animate-bounce delay-300"/>
                    </div>
                )
            }
            <div className="h-5 w-full" ref={scrollRef}/>
        </div>
    );
}