"use client";
import { ForwardMessageModal } from "@/components/modals/forward-message-modal";
import { UploadDocumentModal } from "@/components/modals/upload-document-modal";
import { UploadImageModal } from "@/components/modals/upload-image-modal";
import { UserProfileModal } from "@/components/modals/user-profile-modal";
import { RecordModal } from "@/components/modals/voice-recorder-modal";
import { useEffect, useState } from "react";

export const ModalProvider = () => {

    const [mounted, setMounted] = useState(false);

    useEffect(()=>{
        setMounted(true);
    }, []);

    if(!mounted){
        return null;
    }

    return (
        <>
            <UploadImageModal/>
            <UploadDocumentModal/>
            <RecordModal/>
            <UserProfileModal/>
            <ForwardMessageModal/>
        </>
    );
}
