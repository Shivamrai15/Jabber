"use client";

import { 
    MoreVertical,
    Languages,
    Trash2,
    LogOut
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTranslate } from "@/hooks/use-translate";
import Cookies from "js-cookie";
import {toast} from "sonner";
import axios from "axios";
import { signOut } from "next-auth/react";
import { useState } from "react";

export const ChatSettings = ({
    conversationId
}) => {

    const {isTranslate, setTranslate} = useTranslate();

    const setTranslateValue = ()=>{
        Cookies.set('translate', `${!isTranslate}`);
        setTranslate();
    }

    const [isLogout, setIsLogout] = useState(false);

    const handleDeleteChats = async() =>{
        try {
            await axios.post("/api/delete-chats", {
                conversationId
            });
            toast.info("All chats has been deleted");
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        }
    }

    const onLogout = async() => {
        setIsLogout(true);
        try {
            await signOut();
            toast.success("Logged out sucesfully");
        } catch (error) { 
            console.error(error);
            toast.error("Something went wrong");
        } finally{
            setIsLogout(false);
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <MoreVertical/>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                side="bottom"
                className = "w-72 bg-[#1e1e1e] mr-4"
            >
                <DropdownMenuItem>
                    <div className="w-full flex justify-between items-center">
                        <div className="flex items-center gap-x-4">
                            <Languages/>
                            <Label htmlFor="translation-mode">Translate to english</Label>
                        </div>
                        <Switch
                            id = "translation-mode"
                            checked = {isTranslate}
                            onCheckedChange = {setTranslateValue}
                        />
                    </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick = {handleDeleteChats}
                    className = "flex w-full justify-between items-center"
                >
                    <Trash2/>
                    <span>
                        Delete Chats
                    </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuItem
                    className = "flex w-full justify-between items-center"
                    disabled = {isLogout}
                    onClick = {onLogout}
                >
                    <LogOut/>
                    <span>
                        Logout
                    </span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}