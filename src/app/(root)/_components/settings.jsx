"use client"
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader2, SettingsIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";



export const Settings = ({user}) => {

    const [isLogout, setIsLogout] = useState(false);

    const handleOnClick = async()=>{
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
            <DropdownMenuTrigger>
                <SettingsIcon className = "h-5 w-5 text-zinc-300" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className = "w-72 bg-neutral-950 border-none text-white">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <div className="flex flex-col gap-y-4 w-full p-4">
                    <Avatar className = "h-16 w-16">
                        <AvatarImage  src = {user?.image} />
                    </Avatar>
                    <p className="w-full truncate text-xs text-zinc-400">
                        {user?.email}
                    </p>
                </div>
                <DropdownMenuSeparator className = "bg-zinc-600" />
                <Button 
                    onClick = {handleOnClick}
                    disable = {isLogout}
                    className = "text-zinc-300 bg-neutral-900 hover:bg-neutral-800 text-sm w-full m-0 cursor-default md:cursor-pointer"
                >
                    {isLogout ? (
                        <Loader2
                            className="h-5 w-5 animate-spin"
                        />
                    ) : (
                        <span>
                            Logout
                        </span>
                    )}
                </Button>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

