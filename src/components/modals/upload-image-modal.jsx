"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useEffect, useState } from "react";
import Image from "next/image";

import { Progress } from "../ui/progress";
import { cn } from "@/lib/utils";
import {toast} from "sonner";
import { useEdgeStore } from "@/lib/edgestore";
import { useImageModal } from "@/hooks/use-image-modal";
import { Button } from "../ui/button";
import axios from "axios";
import { Input } from "../ui/input";


export const UploadImageModal = () => {


    const { edgestore } = useEdgeStore();
    const { isOpen, onClose, data } = useImageModal();


    const [isUploading, setIsUploading] = useState(false);
    const [fileIsUploaded, setFileIsUploaded] = useState(false);
    const [progress, setProgress] = useState(0);
    const [file, setFile] = useState();
    const [responseUrl, setResponseUrl] = useState(null);
    const [message, setMessage] = useState("");

    const uploadImage = async () =>{
        try{
                setIsUploading(true);
                const res = await edgestore.publicFiles.upload({
                file,
                onProgressChange: (progress) => {
                    setProgress(progress)
                },
                });
                setResponseUrl(res.url);
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

            const msg_data =  JSON.stringify({
                url : responseUrl,
                message
            });

            await axios.post("/api/send-message", {
                text : msg_data,
                type : "image",
                conversationId : data.conversationId,
                sessionId : data.sessionId,
                conversationFriendId : data.conversationFriendId,
                conversationFriend : data.conversationFriend
            });
            handleOnCancel();
        } catch (error) {
            toast.error("Something went wrong!");
        }
        
    }
    
    
    const handleOnChange = async(e)=>{
        try {
            const image = await e.target.files?.[0];
            console.log(image);
            setFile(image);
        } catch (error) {
            console.error(error);
            toast.error("Cannot upload this file. Please try again!");
        }
    }

    useEffect(() => {
        if (file) {
            uploadImage();
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
                        Upload Image
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
                                        <div className="h-20 w-20 relative">
                                            <Image 
                                                src = "/images/picture.png"
                                                fill
                                                alt="Album"
                                            />
                                        </div>
                                        <p className="text-xs text-zinc-400 mt-4">Click here to upload image</p>
                                        <input type="file" accept='image/*' className='w-0 h-0' onChange={handleOnChange} />
                                    </label>
                                ) : (
                                    responseUrl && (
                                        <Image
                                            className="object-cover"
                                            fill
                                            alt="Image"
                                            src={responseUrl}
                                        />
                                    )
                                )
                            )
                        }
                    </div>
                </div>
                <Input
                    className = "w-full h-10 bg-neutral-800 border border-zinc-500 outline-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-200 placeholder:text-zinc-500"
                    placeholder = "Type a message"
                    value = {message}
                    onChange = {(e)=>setMessage(e.target.value)}
                />
                <div className="w-full flex justify-between items-center mt-4">
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
                        Share Image
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
