"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";

import { Progress } from "../ui/progress";
import { cn, parseSize } from "@/lib/utils";
import { FaRegFile } from "react-icons/fa";
import {toast} from "sonner";
import { useEdgeStore } from "@/lib/edgestore";
import { Button } from "../ui/button";
import axios from "axios";
import { useDocumentModal } from "@/hooks/use-document-modal";
import { LuFileCheck } from "react-icons/lu";
import { nanoid } from "nanoid";


export const UploadDocumentModal = () => {


    const { edgestore } = useEdgeStore();
    const { isOpen, onClose, data } = useDocumentModal();


    const [isUploading, setIsUploading] = useState(false);
    const [fileIsUploaded, setFileIsUploaded] = useState(false);
    const [progress, setProgress] = useState(0);
    const [file, setFile] = useState();
    const [responseUrl, setResponseUrl] = useState(null);

    const uploadDocument = async () =>{
        try{
                setIsUploading(true);
                const res = await edgestore.publicFiles.upload({
                file,
                onProgressChange: (progress) => {
                    setProgress(progress)
                },
                });
                const data = JSON.stringify({
                    fileName : file.name,
                    url : res.url,
                    size : parseSize(file.size)
                });
                setResponseUrl(data);
                setFileIsUploaded(true);
            }
        catch (error){
            console.error("upload error", error);
            toast.error("Cannot upload this file. Please try again!");

        }finally{
            setIsUploading(false);
            setProgress(0);
        }
    }

    const sendMessage = async () => {
        try {
            if (responseUrl !== null){
                axios.post("/api/send-message", {
                    id : nanoid(),
                    text : responseUrl,
                    type : "document",
                    conversationId : data.conversationId,
                    sessionId : data.sessionId,
                    conversationFriendId : data.conversationFriendId,
                    isReceived : false,
                    timestamp : Date.now()
                });
                handleOnCancel();
            }
        } catch (error) {
            toast.error("Something went wrong!");
        }
        
    }
    
    
    const handleOnChange = async(e)=>{
        try {
            const doc = await e.target.files?.[0];
            console.log(doc);
            setFile(doc);
        } catch (error) {
            console.error(error);
            toast.error("Cannot upload this file. Please try again!");
        }
    }

    useEffect(() => {
        if (file) {
            uploadDocument();
        }
    }, [file]);

    const handleOnCancel = ()  => {
        onClose();
        setIsUploading(false);
        setFileIsUploaded(false);
        setProgress(0);
        setFile(null);
        setResponseUrl(null);
    }

    return (
        <Dialog open = {isOpen} onOpenChange={handleOnCancel}>
            <DialogContent className = "max-w-sm md:max-w-md bg-neutral-900">
                <DialogHeader>
                    <DialogTitle className = "text-center">
                        Upload Documnet
                    </DialogTitle>
                </DialogHeader>
                <div className="w-full flex justify-center items-center mt-4">
                    <div className={cn(
                        "mx-auto flex flex-col relative justify-center overflow-hidden items-center w-full h-52 bg-neutral-800 rounded-lg border border-zinc-600",
                        isUploading && "px-4"
                    )}>
                        {
                            isUploading ? (
                                <Progress 
                                    value = {progress} 
                                    className = "w-full mx-4 bg-neutral-900"
                                />
                            ) : (
                                fileIsUploaded === false ? (
                                    <label className="w-full h-full flex flex-col justify-center items-center md:cursor-pointer">
                                        <FaRegFile className="w-10 h-10 text-purple-600" />
                                        <p className="text-xs text-zinc-400 mt-4">Click here to upload document</p>
                                        <input type="file" accept='*' className='w-0 h-0' onChange={handleOnChange} />
                                    </label>
                                ) : (
                                    <LuFileCheck className="w-10 h-10 text-purple-600" />
                                )
                            )
                        }
                    </div>
                </div>
                <div className="w-full flex justify-between items-center">
                    <Button
                        disable = {isUploading}
                        className = "bg-neutral-900 border-none cursor-default md:cursor-pointer"
                        size = "sm"
                        variant = "outline"
                        onClick = {handleOnCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick = {sendMessage}
                        disable = {isUploading}
                        className = "bg-purple-600 hover:bg-purple-700 text-white cursor-default md:cursor-pointer"
                        size = "sm"
                    >
                        Share Document
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
