"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

export const RequestMessage = ({
    data,
    acceptRequest,
    denyRequest
}) => {

    return (
        <div className="w-72 md:w-96 flex items-center justify-between px-3 py-3 bg-neutral-900 rounded-lg gap-x-4">
            <Avatar>
                <AvatarImage src = {data.image} />
            </Avatar>
            <div className="flex flex-col gap-y-1 w-36 md:w-40 truncate">
                <p className="text-sm text-white">{data.name}</p>
                <p className="text-xs text-zinc-400">{data.email}</p>
            </div>
            <Button
                onClick = {()=>acceptRequest(data.id)}
                className = "bg-sky-500 hover:bg-sky-600 cursor-default md:cursor-pointer"
                size = "sm"
                aria-label = "accept request"
            >
                <Check/>
            </Button>
            <Button
                onClick = {()=>denyRequest(data.id)}
                className = "bg-rose-500 hover:bg-rose-600 cursor-default md:cursor-pointer"
                size = "sm"
                aria-label = "deny request"
            >
                <X/>
            </Button>
        </div>
    )
}