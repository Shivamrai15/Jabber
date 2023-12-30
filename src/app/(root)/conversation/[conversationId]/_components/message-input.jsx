"use client";
import { Input } from "@/components/ui/input"
import axios from "axios";
import { MicIcon } from "lucide-react"
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Media } from "./media";
import { IconPicker } from "./emoji-picker";
import { useRecordModal } from "@/hooks/use-recorder-modal";
import { useTranslate } from "@/hooks/use-translate";


export const MessageInput = ({
    sessionId,
    conversationFriendId,
    conversationId,
    conversationFriend
}) => {

    const [textMessage, setTextMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { setData, onOpen } = useRecordModal();
    const { isTranslate } = useTranslate();

    const options = {
        method: 'POST',
        url: 'https://microsoft-translator-text.p.rapidapi.com/translate',
        params: {
          'to[0]': 'en',
          'api-version': '3.0',
          from: 'hi',
          profanityAction: 'NoAction',
          textType: 'plain'
        },
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com'
        },
        data: [
          {
            Text: textMessage
          }
        ]
    };

    useEffect(()=>{
        setData({
            sessionId,
            conversationId,
            conversationFriendId,
            conversationFriend
        });
    }, [conversationFriendId, conversationId]);
    

    const sendMessage = async()=>{
        try {
            setIsLoading(true);
            if(textMessage.length === 0){
                setTextMessage("");
                setIsLoading(false);
                return;
            }
            let text_message = textMessage;
            if(isTranslate){
                const response = await axios.request(options);
                const text = response.data;
                text_message = text[0]['translations'][0]['text'];
            }
            setTextMessage("");
            setIsLoading(false);
            await axios.post("/api/send-message", {
                text : text_message,
                type : "text",
                isEdited : false,
                conversationId : conversationId,
                sessionId,
                conversationFriendId,
                conversationFriend
            });
        } catch (error) {
            toast.error("Something went wrong!");
        }
    }

    const onIconChange = (icon) =>{
        setTextMessage((text) => `${text}${icon}`);
    }

    const handleOnEnter = async(e)=>{
        if (e.key === "Enter" && !e.shiftKey){
            e.preventDefault();
            sendMessage();
        }

        if(e.key === "Backspace" && (textMessage.length === 1 || e.ctrlKey)){
            await axios.post("/api/start-typing", {
                conversationId,
                conversationFriendId,
                isTyping : false
            });
        }

        else if(textMessage.length === 1){
            await axios.post("/api/start-typing", {
                conversationId,
                conversationFriendId,
                isTyping : true
            });
        }

    }


    return (
        <div className="w-full h-24 flex justify-between">
            <div className="w-full mx-5 md:mx-10 lg:mx-28 xl:mx-56 h-12">
                <div className="border-t border-zinc-600 w-full rounded-full"/>
                <div className="w-full h-14 mt-5 flex items-center">
                    <div className="flex flex-1 items-center w-full h-full">
                        <div className="flex w-full h-full rounded-2xl rounded-br-none items-center bg-neutral-900 px-4">
                            <Media
                                sessionId = {sessionId}
                                conversationFriendId = {conversationFriendId}
                                conversationId = {conversationId}
                                conversationFriend = {conversationFriend}
                            />
                            <div className="hidden md:flex justify-center items-center">
                                <IconPicker
                                    onIconChange={onIconChange}
                                />
                            </div>
                            <Input
                                className = "w-full h-8 bg-neutral-900 border-0 outline-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-200 placeholder:text-zinc-600" 
                                placeholder  = "Type a message"
                                value = {textMessage}
                                disabled = {isLoading}
                                onChange = {(e)=>setTextMessage(e.target.value)}
                                onKeyDown = {(e)=>handleOnEnter(e)}
                            />
                        </div>
                        <div className="h-full bg-neutral-900">
                            <div className="bg-neutral-800 h-full rounded-bl-2xl w-5"/>
                        </div>
                    </div>
                    {/* <div
                        className="w-14 h-14 flex justify-center items-center bg-neutral-900 rounded-full cursor-default md:cursor-pointer"
                        onClick={onOpen}
                    >
                        <MicIcon/>
                    </div> */}
                </div>
            </div>
        </div>
    )
}