"use client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

import {
    Paperclip
} from "lucide-react";

import { BsImage } from "react-icons/bs";
import { GoFileDirectory } from "react-icons/go";
import { useImageModal } from "@/hooks/use-image-modal";
import { useState } from "react";
import { useDocumentModal } from "@/hooks/use-document-modal";



export const Media = ({
    sessionId,
    conversationFriendId,
    conversationId,
    conversationFriend
}) => {

    const { onOpen, setData } =useImageModal();

    const { onOpen : onOpenDocument, setData : setDocumentData } = useDocumentModal();

    useState(()=>{
        setData({
            sessionId,
            conversationId,
            conversationFriendId,
            conversationFriend
        });
        setDocumentData({
            sessionId,
            conversationId,
            conversationFriendId,
            conversationFriend
        });

    }, [sessionId, conversationId, conversationFriendId]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Paperclip className="text-white"/>
            </DropdownMenuTrigger>
            <DropdownMenuContent className = "w-56 bg-neutral-900 border border-zinc-600 py-4" side = "top">
                <div className="grid grid-rows-2">
                    <DropdownMenuItem
                        onClick = {onOpen}
                        className = "focus:bg-neutral-800 text-sm text-zinc-400 focus:text-white md:cursor-pointer"
                    >
                        <BsImage className="h-4 w-4 ml-4" />
                        <span className="ml-4">
                            Images
                        </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick = {onOpenDocument}
                        className = "focus:bg-neutral-800 text-sm text-zinc-400 focus:text-white md:cursor-pointer"
                    >
                        <GoFileDirectory className="h-5 w-5 ml-4" />
                        <span className="ml-3">Documents</span>
                    </DropdownMenuItem>
                </div>

            </DropdownMenuContent>
        </DropdownMenu>
    )
}