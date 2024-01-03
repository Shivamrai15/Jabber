"use client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useProfileModal } from "@/hooks/use-profile-modal";
import { useEffect } from "react";

export const UserProfile = ({user})=>{

    const { setProfileData, onOpen } = useProfileModal();

    useEffect(()=>{
        setProfileData(user);
    }, [user]);

    return (
        <Avatar onClick = {onOpen} className = "h-10 w-10 md:cursor-pointer">
            <AvatarImage src = {user.image}/>
        </Avatar>
    )
}