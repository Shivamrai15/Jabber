"use client";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ImageTypeMessage } from "./image-type-message";
import { DocumenTypeMessage } from "./document-type-message";
import { RecordingTypeMessage } from "./recording-type-message";

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
    Atom,
    Forward,
} from "lucide-react";

export const MessageBox = ({
    data,
    isCurrentUser,
    hasNextMessageFromSameUser
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
                                "px-4 py-2 rounded-3xl inline-block cursor-default",
                                !containsOnlyEmojis(data.text) && isCurrentUser ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white" : "bg-[#1b1b1b] text-white", 
                                !hasNextMessageFromSameUser && isCurrentUser && "rounded-br-none",
                                !hasNextMessageFromSameUser && !isCurrentUser && "rounded-bl-none",
                                data.type === "text" && containsOnlyEmojis(data.text) && "bg-transparent text-5xl text-center"
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
                    
                    data.type === "text" &&
                    <ContextMenuItem onClick = {copyMessage}>
                        <Copy className="h-5 w-5 ml-2 mr-4"/>
                        Copy
                    </ContextMenuItem>
                }
                <ContextMenuItem>
                    <Forward className="h-5 w-5 ml-2 mr-4"/>
                    Forward
                </ContextMenuItem>
                {
                    isCurrentUser && 
                    <ContextMenuItem>
                        <Pencil className="h-5 w-5 ml-2 mr-4"/>
                        Edit
                    </ContextMenuItem>
                }
                {
                    !isCurrentUser && data.type === "text" &&
                    <ContextMenuItem>
                        <Atom className="h-5 w-5 ml-2 mr-4"/>
                        Ask to AI
                    </ContextMenuItem>
                }
                {
                    isCurrentUser && 
                    <ContextMenuItem>
                        <Trash2 className="h-5 w-5 ml-2 mr-4"/>
                        Delete
                    </ContextMenuItem>
                }
            </ContextMenuContent>
        </ContextMenu>
    );
}
