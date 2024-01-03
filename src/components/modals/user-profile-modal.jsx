"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import {
    Info
} from "lucide-react";

import { useProfileModal } from "@/hooks/use-profile-modal";
import Image from "next/image";



export const UserProfileModal = ()=>{

    const { isOpen, profileData, onClose } = useProfileModal();

    return (
        <Dialog open = {isOpen} onOpenChange={onClose}>
            <DialogContent className = "w-80 md:w-96 dark:bg-neutral-900">
                <DialogHeader>
                    <DialogTitle className = "flex items-center font-semibold gap-x-2">
                        <Info className="h-5 w-5"/>
                        Profile
                    </DialogTitle>
                </DialogHeader>
                <div className="w-full flex items-center justify-center">
                    <div className="w-64 h-64 rounded-full overflow-hidden relative pointer-events-none">
                        <Image 
                            src={profileData?.image}
                            alt = "Profile Image"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <div className="flex flex-col justify-start w-full my-3 space-y-2">
                        <h2 className="text-[15px] text-zinc-200">{profileData?.name}</h2>
                        <p className="text-[13px] text-muted-foreground">{profileData?.email}</p>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}