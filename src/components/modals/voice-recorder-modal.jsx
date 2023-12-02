"use client";

import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog"
// import { useEffect, useState } from "react";

// import {
//     MicIcon,
//     Trash2,
//     StopCircle,
//     SendHorizontal
// } from "lucide-react";

// import { FaPlay, FaPause } from "react-icons/fa";

// import {toast} from "sonner";
// import { useEdgeStore } from "@/lib/edgestore";
// import axios from "axios";
import { useRecordModal } from "@/hooks/use-recorder-modal";
// import RecordRTC from 'recordrtc';
// import { MediaStreamRecorder } from "recordrtc";
// import { Spinner } from "../spinner";



export const RecordModal = () => {


    // const { edgestore } = useEdgeStore();
    const { isOpen, onClose, data } = useRecordModal();

    // const [recorder, setRecorder] = useState(null);
    // const [isRecording, setIsRecording] = useState(false);
    // const [recordedAudio, setRecordedAudio] = useState(null);
    // const [elapsedTime, setElapsedTime] = useState(0);
    // const [isSending, setIsSending] = useState(false);
    // const [sendRecordingMessage, setSendRecordingMessage] = useState(false);
    
    // const Icon = isRecording ? FaPause : FaPlay;

    // const sendMessage = async () => {
    //     try {

    //         setIsSending(true);
    //         setIsRecording(false);
    //         setElapsedTime(0);

    //         const res = await edgestore.publicFiles.upload({
    //             file : recordedAudio,
    //         });

    //         await axios.post("/api/send-message", {
    //             text : res.url,
    //             type : "recording",
    //             conversationId : data.conversationId,
    //             sessionId : data.sessionId,
    //             conversationFriendId : data.conversationFriendId,
    //             conversationFriend : data.conversationFriend
    //         });

    //         handleClose();

    //     } catch (error) {
    //         console.error(error);
    //         toast.error("Something went wrong!");
    //     }

    //     finally{
    //         setIsSending(false);
    //     }
    // }
    

    // const sendRecording = ()=>{
    //     setSendRecordingMessage(true);
    //     if(elapsedTime > 0 ){
    //         stopRecording();
    //     }
    // }

    // useEffect(()=>{
    //     if(recordedAudio && sendRecordingMessage){
    //         sendMessage();
    //     }
    // }, [recordedAudio, sendRecordingMessage]);



    // const startRecording = () => {
    //     navigator.mediaDevices.getUserMedia({ audio: true })
    //         .then((stream) => {
    //             const newRecorder = RecordRTC(stream, { type: 'audio', mimeType : 'audio/wav', recorderType: MediaStreamRecorder });
    //             setRecorder(newRecorder);
    //             newRecorder.startRecording();
    //             newRecorder.stream = stream;
    //             setIsRecording(true);
    //             const intervalId = setInterval(() => {
    //             setElapsedTime((prevTime) => prevTime + 1);
    //             }, 1000);
    //             newRecorder.intervalId = intervalId;
    //         })
    //         .catch((error) => {
    //             console.error('Error accessing microphone:', error);
    //             toast.error("Something went wrong");
    //         });
    // };

    // const stopRecording = () => {
    //     if (recorder) {
    //         recorder.stopRecording(() => {
    //             clearInterval(recorder.intervalId);
    //             const audioBlob = recorder.getBlob();
    //             const audioFile = new File(
    //                 [audioBlob],
    //                 `JabberRecording-${Date.now()}.mp3`,
    //                 {
    //                   type: "audio/mp3",
    //                   lastModified: Date.now()
    //                 }
    //             );
    //             setRecordedAudio(audioFile);
    //             recorder.stream.stop();
    //             setIsRecording(false);
    //         });
    //     }
    // };

    // const deleteRecording = () => {
    //     if (recorder) {
    //         recorder.stopRecording(() => {
    //             clearInterval(recorder.intervalId);
    //             recorder.stream.stop();
    //         });
    //     }
    //     clearStates();
    // }

    // const clearStates =  () => {
    //     setRecorder(null);
    //     setIsRecording(false);
    //     setRecordedAudio(null);
    //     setElapsedTime(0);
    // }
    
    // const pauseRecording = () => {
    //     if (recorder) {
    //         recorder.pauseRecording();
    //         clearInterval(recorder.intervalId);
    //         setIsRecording(false);
    //     }
    // };

    // const toggleRecording = () => {
    //     if(isRecording){
    //         pauseRecording();
    //     }else{
    //         startRecording();
    //     }
    // }
    
    // const handleClose = ()=>{
    //     onClose();
    //     clearStates();
    // }

    return (
        <Dialog open = {isOpen} onOpenChange={onClose} >
            <DialogContent className = "max-w-sm md:max-w-md bg-neutral-900">
                <div className="flex w-full h-72 justify-center items-center text-sm text-zinc-400">
                    This feature is under development phase
                </div>
                {/* <div className="w-full flex justify-center items-center mt-8">
                    <div className="h-20 w-20 flex justify-center items-center">
                        {
                            (elapsedTime === 0 && !isRecording) ? <MicIcon className="h-14 w-14 text-white"/> :
                            <span className="text-3xl font-extrabold">
                                {elapsedTime}
                            </span>
                        }
                    </div>
                </div>
                <div className="mx-auto py-8 grid grid-cols-4 gap-x-8">
                    <Trash2
                        onClick={deleteRecording}
                        className="h-7 w-7 text-red-500 md:cursor-pointer"
                    />
                    <StopCircle
                        onClick={stopRecording}
                        className="h-7 w-7 text-red-500 md:cursor-pointer"
                    />
                    <Icon
                        onClick={toggleRecording}
                        className="h-6 w-6 md:cursor-pointer"
                    />
                    {
                        isSending ? <Spinner className="h-7 w-7" /> :
                        <SendHorizontal
                            role="button"
                            onClick={sendRecording}
                            aria-disabled = {recordedAudio === null}
                            className="h-7 w-7 text-purple-600 md:cursor-pointer"
                        />
                    }
                </div> */}
            </DialogContent>
        </Dialog>
    );
}