"use client";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ImageTypeMessage } from "./image-type-message";
import { DocumenTypeMessage } from "./document-type-message";
import { useEffect } from "react";
import { RecordingTypeMessage } from "./recording-type-message";

export const MessageBox = ({
    data,
    isCurrentUser,
    hasNextMessageFromSameUser
}) => {

    const formatTimeStamp = (timestamp)=>{
        if (!timestamp) return '';
        return format(timestamp, "dd-LLL HH:mm")
    }

    return (
        <div>
            <div
                className={cn(
                    "flex items-end py-2",
                    isCurrentUser && "justify-end"
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
                        "px-4 py-2 rounded-lg inline-block",
                        isCurrentUser ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white" : "bg-[#1b1b1b] text-white", 
                        !hasNextMessageFromSameUser && isCurrentUser && "rounded-br-none",
                        !hasNextMessageFromSameUser && !isCurrentUser && "rounded-bl-none",
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
                        <span
                            className = {cn(
                                "text-[10px] text-zinc-200 whitespace-nowrap",
                                data.type === "text" && "ml-2"
                            )}
                        >
                            {formatTimeStamp(data.timestamp)}
                        </span>
                    </span>
                </div>
            </div>
        </div>
    );
}
