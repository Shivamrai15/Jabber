"use client";

import EmojiPicker, {Theme} from "emoji-picker-react";

import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover";

import {
    SmileIcon
} from "lucide-react";

export const IconPicker = ({
    onIconChange,
}) => {

    return (
        <Popover>
            <PopoverTrigger>
                <SmileIcon className="text-white ml-4"/>
            </PopoverTrigger>
            <PopoverContent className = "p-0 w-full border-none shadow-none bg-neutral-900">
                <EmojiPicker
                    height = {350}
                    theme = {Theme.DARK}
                    onEmojiClick = {(data)=>onIconChange(data.emoji)}
                />
            </PopoverContent>
        </Popover>
    );
}