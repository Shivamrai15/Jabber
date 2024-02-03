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
import {toast} from "sonner";
import axios from "axios";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { DeleteMessagesDialog } from "@/components/modals/delete-messages-dialog";

export const ChatSettings = ({
    conversationId
}) => {

    const {isTranslate, setTranslate} = useTranslate();

    const setTranslateValue = ()=>{
        setTranslate();
    }

    const [isLogout, setIsLogout] = useState(false);
    const [ isOpen, setOpen ] = useState(false);
    const [ loading, setLoading ] = useState(false);
    const [mounted, setMounted] = useState(false);

    const handleDeleteChats = async() =>{
        try {
            setLoading(true);
            await axios.post("/api/delete-chats", {
                conversationId
            });
            toast.info("All chats has been deleted");
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setLoading(true);
            setOpen(false);
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

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <>
            <DeleteMessagesDialog
                isOpen={isOpen}
                setOpen={setOpen}
                onConfirm={handleDeleteChats}
                disabled = { loading }
            />
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
                                <Languages className="h-5 w-5"/>
                                <Label htmlFor="translation-mode text-sm">Translate to english</Label>
                            </div>
                            <Switch
                                id = "translation-mode"
                                checked = {isTranslate}
                                onCheckedChange = {setTranslateValue}
                            />
                        </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick = {() => setOpen(true)} 
                        className = "flex w-full items-center text-sm text-red-500 group"
                    >
                        <Trash2 className="text-red-500 h-5 w-5 mr-4" />
                        <span className="group-hover:text-red-600">
                            Delete Chats
                        </span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem
                        className = "flex w-full items-center text-sm"
                        disabled = {isLogout}
                        onClick = {onLogout}
                    >
                        <LogOut className="h-5 w-5 mr-4"/>
                        <span>
                            Logout
                        </span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}