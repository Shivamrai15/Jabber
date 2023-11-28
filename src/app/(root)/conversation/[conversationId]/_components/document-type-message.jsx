"use client";
import { HiDownload } from "react-icons/hi";
import { toast } from "sonner";
import axios from "axios";
import { useState } from "react";
import {
    Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

export const DocumenTypeMessage = ({data}) => {

    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownlaod = async()=>{
        try {
            setIsDownloading(true);
            const response = await axios.get(data.url, {
                responseType : 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));

            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = data.fileName;
            document.body.append(a);
            a.click();
            window.URL.revokeObjectURL(url);
            
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally{
            setIsDownloading(false);
        }
    }

    const Icon = isDownloading ? Loader2 : HiDownload

    return (
        <div className="w-64 h-16 mt-2  bg-black bg-opacity-50 rounded-md flex items-center px-3 gap-x-4">
            <div
                role="button"
                onClick={handleDownlaod}
                className = "rounded-full p-2 bg-opacity-60 border border-zinc-600 bg-black cursor-default md:cursor-pointer"
            >
                <Icon className={cn(
                    "h-6 w-6",
                    isDownloading && "animate-spin"
                )}/>
            </div>
            <div className="w-full truncate flex flex-col">
                <p className="text-sm truncate">{data.fileName}</p>
                <span className="text-xs text-zinc-400" >{data.size}</span>
            </div>
        </div>
    );
}
