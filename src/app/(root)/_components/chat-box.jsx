"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

export const ChatBox = ({
    href,
    data,
    pathname,
    unseenMessagesCount,
    lastMessage,
    chatId
}) => {

    const router = useRouter();

    const formatTimeStamp = (timestamp)=>{
        if (!timestamp) return '';
        return format(timestamp, "HH:mm");
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
                        <p className="text-xs text-zinc-400 truncate">
                            {
                                lastMessage?.type === "text" ? (
                                    <span>
                                        {lastMessage?.text}
                                    </span>
                                ) :
                                lastMessage?.type === "image" ? (
                                    <span>
                                        Image
                                    </span>
                                ) : (
                                    <span>
                                        Document
                                    </span>
                                )
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