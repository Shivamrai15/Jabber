"use client";
import { UploadDocumentModal } from "@/components/modals/upload-document-modal";
import { UploadImageModal } from "@/components/modals/upload-image-modal";
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
        </>
    );
}