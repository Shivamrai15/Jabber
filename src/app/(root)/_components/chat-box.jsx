"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export const ChatBox = ({
    href,
    data,
    pathname,
    unseenMessagesCount
}) => {

    const router = useRouter();

    return (
        <li className={cn(
            "w-full rounded-md hover:bg-neutral-800",
            pathname === href && "bg-[#2e2e2e]"
        )}>
            <div
                onClick={()=>router.push(href)}
                className="w-full px-3 py-3 flex items-center justify-between gap-x-4 md:cursor-pointer"
            >
                <div className="flex items-center w-full gap-x-4">
                    <Avatar>
                        <AvatarImage src = {data.image}/>
                    </Avatar>
                    <span className="text-sm text-white truncate font-semibold">
                        {data.name}
                    </span>
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