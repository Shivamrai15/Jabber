"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { useForwardMessageModal } from "@/hooks/use-forward-message-modal";
import { useFriends } from "@/hooks/use-friends";
import { ForwardBox } from "@/components/forward-box";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { conversationIdGenerator } from "@/lib/utils";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { useLastMessage } from "@/hooks/use-last-message";
import { nanoid } from "nanoid";

export const ForwardMessageModal = () => {

    const { friends } = useFriends();
    const { isOpen, onClose, forwardMessage } = useForwardMessageModal();
    const { setLastMessages } = useLastMessage()

    const [search , setSearch] = useState("");
    const [friendData, setFriendData] = useState(friends);
    const [isSelected, setIsSelected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [selectedIds, setSelectedIds] = useState(()=>{
        const data = {}
        if( friends){
            for (let i=0; i<friends.length; i++){
                data[friends[i].id] = false
            }
        }
        return data; 
    });

    const handleForwardMessage = async()=>{
        try {

            setIsLoading(true);
    
            const request_ids = [];
    
            for (let id in selectedIds) {
                if (selectedIds[id] === true) {
                    request_ids.push(id)
                }
            }
            
            onClose();
            
            const response = await Promise.all(
                request_ids.map( async(friendId)=>{
                    const data = {
                        id : nanoid(),
                        text : forwardMessage.text,
                        type : forwardMessage.type,
                        sessionId : forwardMessage.senderId,
                        conversationId : conversationIdGenerator(friendId, forwardMessage.senderId),
                        conversationFriendId : friendId,
                        isReceived : false,
                        timestamp : Date.now()
                    }
                    await axios.post("/api/send-message", data);
                    return data;
                } )
            );
                
                
            response.map((message)=>{
                setLastMessages(message, message.conversationId); 
            });
                
            } catch (error) {
                console.log(error);
            toast.error("Something went wrong");
        }
        finally{
            setIsLoading(false);
            setIsSelected(false);
            setSelectedIds(()=>{
                const data = {}
                for (let i=0; i<friends.length; i++){
                    data[friends[i].id] = false
                }
                return data; 
            });
        }
    }

    useEffect(()=>{
        setIsSelected(()=>{
            for (let key in selectedIds) {
                if (selectedIds[key] === true) {
                    return true;
                }
            }
        });
    }, [selectedIds, setSelectedIds]);

    const handleSearch = (e)=>{
        const para = e.target.value;
        setSearch(para);
        setFriendData(
            friends.filter((value)=>value.name.toLowerCase().includes(para.toLowerCase()))
        );
        console.log(selectedIds);
    }

    return (
        <Dialog open = {isOpen} onOpenChange={onClose}>
            <DialogContent className = "bg-neutral-900 max-w-sm md:max-w-md space-y-2">
                <DialogHeader>
                    <DialogTitle>
                        Forward to...
                    </DialogTitle>
                </DialogHeader>
                <Input
                    className = "w-full h-10 bg-neutral-950/30 border border-zinc-500 outline-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-200 placeholder:text-zinc-400"
                    placeholder = "Search"
                    value = {search}
                    onChange = {(e)=>handleSearch(e)}
                    
                />
                <div className="flex flex-col items-center gap-y-1 max-h-96 w-full overflow-y-auto modal-scroll">
                    {
                        (!friends || friendData.length === 0) && (
                            <div className="my-16 text-sm text-zinc-400">
                                Friends not found
                            </div>
                        )  
                    }
                    { friends && friendData.map((friend)=>(
                        <ForwardBox
                            selectedIds = {selectedIds}
                            setSelectedIds = {setSelectedIds}
                            key={friend.id}
                            data = {friend}
                            disable = {isLoading}
                        />
                    ))}
                </div>
                {
                    isSelected && (
                        <Button
                            onClick = {handleForwardMessage}
                            disable = {isLoading}
                        >
                            {isLoading ? <Loader className="animate-spin" /> : "Forward"} 
                        </Button>
                    ) 
                }
            </DialogContent>
        </Dialog>
    )
}