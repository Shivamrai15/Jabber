"use client";

import {
    useEffect,
    useRef,
    useState
} from "react";
import axios from "axios";
import {toast} from "sonner";
import { useEdgeStore } from "@/lib/edgestore";
import { nanoid } from "nanoid";

import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog"
import {
    MicIcon,
    Trash2,
    StopCircle,
    SendHorizontal
} from "lucide-react";
import { FaPlay } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";

import { cn } from "@/lib/utils";
import { useRecordModal } from "@/hooks/use-recorder-modal";
import { RecordingTypeMessage } from "@/app/(root)/conversation/[conversationId]/_components/recording-type-message";



export const RecordModal = () => {


    const { edgestore } = useEdgeStore();
    const { isOpen, onClose, data } = useRecordModal();

    const [ recording, setRecording ] = useState(false);
    const [ timeElapsed, setTimeElapsed ] = useState(0);
    const audioRef = useRef(null);
    const chunksRef = useRef([]);
    const [ audioString, setAudioString ] = useState("");
    const [ file, setFile ] = useState(null);
    const [ loading, setLoading ] = useState(false);
    
    const Icon = recording ?  StopCircle : FaPlay;

    const sendMessage = async () => {
        try {
            setLoading(true);
            if (!file) return ;

            const res = await edgestore.publicFiles.upload({
                file : file,
            });

            axios.post("/api/send-message", {
                id : nanoid(),
                text : res.url,
                type : "recording",
                conversationId : data.conversationId,
                sessionId : data.sessionId,
                conversationFriendId : data.conversationFriendId,
                isReceived : false,
                timestamp : Date.now()
            });

            handleClose();

        } catch (error) {
            console.error(error);
            toast.error("Something went wrong!");
        }

        finally {
            setLoading(false);
        }
    }

    const onRecording = async() => {
        if (recording) {

            audioRef.current.stop();
            audioRef.current.onstop = () => {
                
                setRecording(false);
                const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
                const url = window.URL.createObjectURL(blob);
                setAudioString(url);

                const file = new File(
                    chunksRef.current,
                    `recording-${nanoid(20)}.mp3`,
                    {
                      type: "audio/mp3",
                      lastModified: Date.now()
                    }
                );

                setFile(file);

                chunksRef.current = [];
            }

        } else {

            const stream = await navigator.mediaDevices.getUserMedia({
                audio : true,
                video : false
            });

            audioRef.current = new MediaRecorder(stream);
            audioRef.current.ondataavailable = handleDataAvailable;
            audioRef.current.start();
            setTimeElapsed(0);
            setRecording(true);

        }
    }

    const onDeleteRecording = () => {

        if (audioRef.current) {
            audioRef.current.stop();
        }
        chunksRef.current = [];
        setTimeElapsed(0);
        setFile(null);
    }

    const handleDataAvailable = (e) => {
        if (e.data.size > 0) {
            chunksRef.current.push(e.data);
        }
    };

    useEffect(()=>{
        
        let intervalId ;

        if ( recording ) {
            intervalId = setInterval(()=>{
                setTimeElapsed((prev) => prev+1 );
            }, 1000);
        } 
        
        return () => {
            clearInterval(intervalId);
        }
        
    }, [recording]);
    
    
    const handleClose = (open) => {

        if (!open) {
            onDeleteRecording();
            onClose();
        }
    }

    return (
        <Dialog open = {isOpen} onOpenChange={handleClose} >
            <DialogContent className = "w-80 sm:w-96 bg-neutral-900">
                <div className="w-full flex justify-center items-center">
                    <div className="h-20 w-20 flex justify-center items-center">
                        {
                            ( timeElapsed === 0 ) ? <MicIcon className="h-14 w-14 text-white"/> :
                            <span className="text-3xl font-extrabold">
                                {timeElapsed}
                            </span>
                        }
                    </div>
                </div>
                <div
                    className={
                        cn(
                            "hidden items-center justify-center",
                            timeElapsed > 0 && !recording && "flex"
                        )
                    }
                >
                    <RecordingTypeMessage url={audioString} />
                </div>
                <div className="mx-auto py-4 grid grid-cols-3 gap-x-8">
                    <Button
                        onClick = {onDeleteRecording}
                        disabled = { loading }
                        variant = "ghost"
                        size = "sm"
                        className = "cursor-default md:cursor-pointer"
                    >
                        <Trash2
                            className="h-6 w-6 text-red-500"
                        />
                    </Button>
                    <Button
                        onClick = {onRecording}
                        disabled = { loading }
                        variant = "ghost"
                        size = "sm"
                        className = "cursor-default md:cursor-pointer"
                    >
                        <Icon
                            className="h-6 w-6"
                        />
                    </Button>

                    <Button
                        onClick = {sendMessage}
                        disabled = { loading }
                        variant = "ghost"
                        size = "sm"
                        className = "cursor-default md:cursor-pointer"
                    >
                        {
                            loading ? <Spinner className="h-6 w-6" /> : (
                                <SendHorizontal
                                    className="h-6 w-6 text-purple-600"
                                />
                            )
                                    
                        }            
                    </Button>
                    
                </div>
            </DialogContent>
        </Dialog>
    );
}