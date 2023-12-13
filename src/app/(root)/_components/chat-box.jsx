"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { ImageIcon, FileIcon } from "lucide-react";

export const ChatBox = ({
    href,
    data,
    pathname,
    unseenMessagesCount,
    lastMessage,
}) => {

    const router = useRouter();

    const formatTimeStamp = (timestamp)=>{
        if (!timestamp) return '';
        const current_timestamp = Date.now();
        const diff_timestamp  = Math.abs(current_timestamp-timestamp)
        if ( diff_timestamp < 24 * 60 * 60 * 1000 ){
            return format(timestamp, "HH:mm");
        }
        else if (diff_timestamp < 48 * 60 * 60 * 1000 && diff_timestamp >= 24 * 60 * 60 * 1000 ){
            return "Yesterday"
        }
        else {
            return format(timestamp, "dd-MM-yy");
        }
    }

    const documentName = (document)=>{
        if (!document)
            return 'Document';
        else {
            const name = JSON.parse(document);
            return name.fileName
        }
    }


    return (
        <li className={cn(
            "w-full rounded-md hover:bg-neutral-800",
            pathname === href && "bg-[#2e2e2e]"
        )}>
            <div
                onClick={()=>router.push(href)}
                className="relative w-full px-3 py-3 flex items-end justify-between md:cursor-pointer"
            >
                <div className="flex items-center w-full gap-x-4">
                    <Avatar>
                        <AvatarImage src = {data.image}/>
                    </Avatar>
                    <div className="flex flex-col gap-y-1 w-44 overflow-hidden">
                        <span className="text-sm text-white truncate font-semibold">
                            {data.name}
                        </span>
                        <p className="text-[13px] text-zinc-400 truncate">
                            {
                                lastMessage?.type === "text" ? (
                                    <span>
                                        {lastMessage?.text}
                                    </span>
                                ) :
                                lastMessage?.type === "image" ? (
                                    <span className="flex items-center justify-start gap-x-2">
                                        <ImageIcon className="h-3 w-3"/>
                                        Image
                                    </span>
                                ) : lastMessage?.type === "document" ? (
                                    <span  className="flex items-center justify-start gap-x-2">
                                        <FileIcon className="h-3 w-3"/>
                                        <span className="truncate w-40">
                                            {documentName(lastMessage?.text)}
                                        </span>
                                    </span>
                                ) : ""
                            }
                        </p>
                    </div>
                </div>
                <div className="absolute text-xs right-2 top-3 text-green-600">
                    {formatTimeStamp(lastMessage?.timestamp)}
                </div>
                {unseenMessagesCount > 0 && 
                    <Badge className="bg-green-600">
                        {unseenMessagesCount}
                    </Badge>
                }
            </div>
        </li>
    );
}