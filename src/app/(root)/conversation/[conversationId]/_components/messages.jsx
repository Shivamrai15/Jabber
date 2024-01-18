"use client";
import { useEffect, useRef, useState} from "react"
import { MessageBox } from "./message-box";
import { pusherClient } from "@/lib/pusher";
import { cn, toPusherKey } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useLastMessage } from "@/hooks/use-last-message";

export const revalidate = 0;

export const Messages = ({messages, setMessages , sessionId, chatId}) => {

    const router = useRouter();
    const pathname = usePathname();
    const scrollRef = useRef(null);
    const [isTyping, setIsTyping] = useState(false);
    const { last_message, setLastMessages } = useLastMessage();

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

        pusherClient.subscribe(
            toPusherKey(`chat:${chatId}:delete-message`)
        );

        const messageHandler = (message) =>{
            setIsTyping(false);
            if (message.senderId === sessionId  && message.type === "text"){
                setMessages((prev)=>prev.map((msg)=>{
                    if (msg.id === message.id){
                        return { ...msg, ...message}
                    }
                    return msg;
                }));
            }else{
                setMessages((prev)=>[...prev, message]);
            }
            setLastMessages(message, chatId);
        }

        const deleteMessages = ()=>{
            setMessages([]);
            setLastMessages('', chatId);
        }

        const deleteSingeMesaage = (deletedMessage) => {
            try {
                const isLastMessage = last_message[chatId]?.id === deletedMessage.id;
                if ( isLastMessage ) {
                    setLastMessages(deletedMessage, chatId);
                }
            } catch (error) {
                console.error(error);
            }
            try {
                setMessages((prev)=>{
                    return prev.map((message)=>{
                        if (message.id === deletedMessage.id){
                            return {
                                ...message, ...deletedMessage, isReceived : true
                            }
                        }
                        return message;
                    });
                });
            } catch (error) {
                console.error(error);
            }
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

        pusherClient.bind(
            "delete_message",
            deleteSingeMesaage
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
            );
            pusherClient.unsubscribe(
                toPusherKey(`chat:${chatId}:delete-message`)
            );
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
            pusherClient.unbind(
                "delete_message",
                deleteSingeMesaage
            );
    
        }
    }, [messages, isTyping]);

    useEffect(()=>{
        router.refresh();
    }, [pathname])

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
                return <MessageBox
                    key = {`${message.id}-${message.timestamp}`}
                    data = {message}
                    conversationId = {chatId}
                    isCurrentUser = {isCurrentUser}
                    hasNextMessageFromSameUser = {hasNextMessageFromSameUser}
                    sessionId = {sessionId}
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
    );
}