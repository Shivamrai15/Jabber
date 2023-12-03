"use client";
import { useEffect, useRef, useState} from "react"
import { MessageBox } from "./message-box";
import { pusherClient } from "@/lib/pusher";
import { cn, toPusherKey } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";

export const revalidate = 0;

export const Messages = ({initialMessages , sessionId, chatId}) => {

    const router = useRouter();
    const pathname = usePathname();
    const scrollRef = useRef(null);
    const [messages, setMessages] = useState(initialMessages);
    const [isTyping, setIsTyping] = useState(false);


    useEffect(()=>{
        scrollRef?.current.scrollIntoView();
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
        }

        const deleteMessages = ()=>{
            setMessages([]);
        }

        const typingStatus = ({
            isTyping,
            conversationFriendId
        }) => {

            console.log("Typing functionn is working", isTyping);


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
    }, [pathname])


    return (
        <div className={cn(
            "w-full h-[calc(100%-160px)] flex-1 flex-col-reverse gap-4 px-5 md:px-8 lg:px-14 overflow-y-auto message-scroll",
            messages.length === 0 && !isTyping && "flex justify-center items-center"
        )}>
            {messages.map((message, index)=>{
                const isCurrentUser = message.senderId === sessionId;
                const hasNextMessageFromSameUser = messages?.[index+1]?.senderId === messages?.[index]?.senderId
                return <MessageBox
                    key = {`${message.id}-${message.timestamp}`}
                    data = {message}
                    isCurrentUser = {isCurrentUser}
                    hasNextMessageFromSameUser = {hasNextMessageFromSameUser}
                />
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
    )
}