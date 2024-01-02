"use client";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ImageTypeMessage } from "./image-type-message";
import { DocumenTypeMessage } from "./document-type-message";
import { RecordingTypeMessage } from "./recording-type-message";
import { toast } from "sonner";
import axios from "axios";

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";

import {
    Copy,
    Trash2,
    Atom,
    Forward,
} from "lucide-react";

export const MessageBox = ({
    data,
    isCurrentUser,
    hasNextMessageFromSameUser,
    conversationId
}) => {

    const formatTimeStamp = (timestamp)=>{
        if (!timestamp) return '';
        return format(timestamp, "dd-LLL HH:mm")
    }

    function containsOnlyEmojis(inputString) {
        const emojiPattern = /[\p{Emoji}]/gu;
        return emojiPattern.test(inputString) && inputString.match(emojiPattern).join('') === inputString;
    }

    const copyMessage = ()=>{
        navigator.clipboard.writeText(data.text);
    }

    const onDeleteMessage = async () => {
        try {
            if(isCurrentUser){
                await axios.patch(
                    "/api/delete-message",
                    {
                        conversationId,
                        data
                    }
                );
                toast.success("Message has been deleted!");
            } else {
                toast.warning("Oops! Looks like you can only delete your own messages here.");
            }
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    }

    return (
        <ContextMenu>
            <ContextMenuTrigger>
                <div>
                    <div
                        className={cn(
                            "flex items-end py-0.5",
                            isCurrentUser && "justify-end",
                            !hasNextMessageFromSameUser && "pb-3"
                        )}
                    >
                        <div
                            className={cn(
                                'flex flex-col space-y-2 text-base text-white max-w-xs mx-2 lg:max-w-sm', 
                                isCurrentUser && "order-1 items-end",
                                !isCurrentUser && "order-2 items-start"
                            )}
                        >
                            <span className={cn(
                                "px-4 py-2 rounded-3xl inline-block cursor-default select-none",
                                !containsOnlyEmojis(data.text) && isCurrentUser ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white" : "bg-[#1b1b1b] text-white", 
                                !hasNextMessageFromSameUser && isCurrentUser && "rounded-br-none",
                                !hasNextMessageFromSameUser && !isCurrentUser && "rounded-bl-none",
                                data.type === "text" && containsOnlyEmojis(data.text) && "bg-transparent text-5xl text-center",
                                data.type === "text" && data.text === "⊘ This message was deleted" && "text-xs py-4",
                            )}>
                                {data.type === "text" && (data.text + ' ')}
                                {data.type === "image" && (
                                    <ImageTypeMessage
                                        data={JSON.parse(data.text)}
                                    />
                                )}
                                { data.type === "document" && (
                                    <DocumenTypeMessage
                                        data = {JSON.parse(data.text)}
                                    />
                                )}
                                {
                                    data.type === "recording" && (
                                        <RecordingTypeMessage
                                            url = {data.text}
                                            isCurrentUser = {isCurrentUser}
                                        />
                                    )
                                }
                                { !containsOnlyEmojis(data.text) && <span
                                    className = {cn(
                                        "text-[10px] text-zinc-200 whitespace-nowrap",
                                        data.type === "text" && "ml-auto"
                                    )}
                                >
                                    {formatTimeStamp(data.timestamp)}
                                </span>}
                            </span>
                        </div>
                    </div>
                </div>
            </ContextMenuTrigger>
            <ContextMenuContent align = "end" className = "w-52 bg-neutral-900">
                {
                    
                    data.type === "text" && data.text !== "⊘ This message was deleted" &&
                    <ContextMenuItem onClick = {copyMessage}>
                        <Copy className="h-5 w-5 ml-2 mr-4"/>
                        Copy
                    </ContextMenuItem>
                }
                {
                    data.text !== "⊘ This message was deleted" &&
                    <ContextMenuItem>
                        <Forward className="h-5 w-5 ml-2 mr-4"/>
                        Forward
                    </ContextMenuItem>
                }
                {
                    !isCurrentUser && data.type === "text" && data.text !== "⊘ This message was deleted" &&
                    <ContextMenuItem>
                        <Atom className="h-5 w-5 ml-2 mr-4"/>
                        Ask to AI
                    </ContextMenuItem>
                }
                {
                    isCurrentUser && data.text !== "⊘ This message was deleted" &&
                    <ContextMenuItem onClick = {onDeleteMessage}>
                        <Trash2 className="h-5 w-5 ml-2 mr-4"/>
                        Delete
                    </ContextMenuItem>
                }
                {
                    data.text === "⊘ This message was deleted" &&
                    <ContextMenuItem className = "text-xs">
                        No options are available for deleted messages
                    </ContextMenuItem>
                }
            </ContextMenuContent>
        </ContextMenu>
    );
}
