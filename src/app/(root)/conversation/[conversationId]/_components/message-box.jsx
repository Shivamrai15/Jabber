"use client";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ImageTypeMessage } from "./image-type-message";
import { DocumenTypeMessage } from "./document-type-message";
import { RecordingTypeMessage } from "./recording-type-message";
import { toast } from "sonner";
import axios from "axios";
import { nanoid } from "nanoid";

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";

import {
    Copy,
    Trash2,
    Forward,
    SendHorizontal,
    ArrowDownToLine
} from "lucide-react";
import { useForwardMessageModal } from "@/hooks/use-forward-message-modal";

const downlaodFile = async( link, filename )=>{
    try {

        const response = await axios.get(link, {
            responseType : 'blob',
        });

        console.log("Response", response);

        const url = window.URL.createObjectURL(new Blob([response.data]));

        console.log(url);

        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        document.body.append(a);
        a.click();
        window.URL.revokeObjectURL(url);
        
    } catch (error) {
        console.error(error);
    } 
}

export const MessageBox = ({
    data,
    isCurrentUser,
    hasNextMessageFromSameUser,
    conversationId,
    sessionId
}) => {

    const { onOpen, setForwardMessage } = useForwardMessageModal();

    const formatTimeStamp = (timestamp)=>{
        if (!timestamp) return '';
        return format(timestamp, "HH:mm a")
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

    const handleForwardMessage = () => {
        const message = { ...data, senderId : sessionId}
        setForwardMessage(message);
        onOpen();
    }

    const handleDownload = async() => {

        const parsedData = JSON.parse(data.text);
        if (data.type === "document"){
            await downlaodFile(parsedData.url, parsedData.fileName);
        } else {
            const extension = parsedData.url.split(".").pop();
            await downlaodFile(parsedData.url, `jb-${nanoid(35)}.${extension}`);
        }
    }

    const isURI = () => {
        try {
            const url = new URL(data.text);
            console.log(url);
            return true
        } catch (error) {
            return false
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
                            <div className = "flex flex-row items-end gap-x-2 transition-all duration-200">
                                <div className={cn(
                                    "px-4 py-1.5 rounded-3xl inline-block cursor-default select-none relative",
                                    !containsOnlyEmojis(data.text) && isCurrentUser ? "bg-[#2a6883] text-white" : "bg-[#1b1b1b] text-white", 
                                    !hasNextMessageFromSameUser && isCurrentUser && "rounded-br-none",
                                    !hasNextMessageFromSameUser && !isCurrentUser && "rounded-bl-none",
                                    isCurrentUser && hasNextMessageFromSameUser && "rounded-br-xl",
                                    !isCurrentUser && hasNextMessageFromSameUser && "rounded-bl-xl",
                                    data.type === "text" && containsOnlyEmojis(data.text) && "bg-transparent text-5xl text-center",
                                )}>
                                    { data.type === "text" && (isURI(data.text) ? (
                                        <a
                                            href={data.text}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="underline pr-2"
                                        >
                                            { data.text + ' '}
                                        </a>
                                    ) : (
                                        <span
                                            className={cn(
                                                data.type === "text" && data.text === "⊘ This message was deleted" && "text-sm italic py-3 mr-2"
                                            )}
                                        >
                                            {(data.text + ' ')}
                                        </span>
                                    ) )}
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
                                            "px-8 ml-2",
                                            data.type === "text" && ""
                                        )}
                                    >
                                    </span>}
                                    { !containsOnlyEmojis(data.text) && <span
                                        className = "absolute bottom-1 right-4 text-xs text-zinc-200 font-medium"
                                    >
                                        {formatTimeStamp(data.timestamp)}
                                    </span>}
                                </div>
                                {
                                    !data.isReceived && <SendHorizontal className="h-3 w-3 text-zinc-400" />
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </ContextMenuTrigger>
            <ContextMenuContent align = "end" className = "w-52 bg-neutral-900">
                {
                    
                    data.type === "text" && data.text !== "⊘ This message was deleted" &&
                    <ContextMenuItem onClick = {copyMessage}>
                        <Copy className="h-5 w-5 ml-2 mr-4"/>
                        {
                            isURI(data.text) ? "Copy link" : "Copy"
                        }
                    </ContextMenuItem>
                }
                {
                    data.text !== "⊘ This message was deleted" &&
                    <ContextMenuItem onClick = {handleForwardMessage}>
                        <Forward className="h-5 w-5 ml-2 mr-4"/>
                        Forward
                    </ContextMenuItem>
                }
                {
                    data.type !== "text" && data.type !== "recording" && (
                        <ContextMenuItem onClick = { handleDownload } >
                            <ArrowDownToLine className="h-5 w-5 ml-2 mr-4" />
                            Download
                        </ContextMenuItem>
                    )
                }
                {
                    isCurrentUser && data.text !== "⊘ This message was deleted" &&
                    <ContextMenuItem onClick = {onDeleteMessage} className = "text-rose-500 focus:text-rose-400 font-semibold">
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
