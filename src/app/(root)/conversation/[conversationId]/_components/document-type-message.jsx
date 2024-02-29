"use client";

import Image from "next/image";

export const DocumenTypeMessage = ({data}) => {

    const extension = data.fileName.split(".").pop();

    const fileIcon = () => {
        switch(extension) {
            case "jpg" : 
                return "/icons/jpg.svg";
            case "jpeg" : 
                return "/icons/jpg.svg";
            case "png" : 
                return "/icons/png.svg";
            case "mp3" : 
                return "/icons/mp3.svg";
            case "zip" : 
                return "/icons/zip.svg";
            case "pdf" : 
                return "/icons/pdf.svg";
            case "docx" : 
                return "/icons/doc.svg";
            case "doc" : 
                return "/icons/doc.svg";
            case "ppt" : 
                return "/icons/ppt.svg";
            case "pptx" : 
                return "/icons/ppt.svg";
            case "gif" : 
                return "/icons/gif.svg";
            case "txt" : 
                return "/icons/txt.svg";
            case "xls" : 
                return "/icons/xls.svg";
            case "csv" : 
                return "/icons/xls.svg";
            case "xlsx" : 
                return "/icons/xls.svg";
            case "svg" : 
                return "/icons/svg.svg";
            case "mp4" : 
                return "/icons/video.svg";
            case "mkv" : 
                return "/icons/video.svg";
            default : 
                return "/icons/file.svg";
        }
    }

    return (
        <div className="w-64 h-14 md:h-16 mt-2  rounded-md flex items-center gap-x-4">
            <div className = "h-12 w-12 md:h-14 md:w-14 relative rounded-sm overflow-hidden">
                <Image
                    src = {fileIcon()}
                    fill
                    className = "object-contain"
                />
            </div>
            <div className="w-full truncate flex flex-col">
                <p className="text-sm truncate">{data.fileName}</p>
                <span className="text-xs text-zinc-200" >{data.size}</span>
            </div>
        </div>
    );
}
