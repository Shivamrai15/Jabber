"use client";

import { useState } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import WaveSurfer from 'wavesurfer.js';
import { useEffect, useRef } from 'react';


export const RecordingTypeMessage = ({
    url,
    isCurrentUser
}) => {

    const [isPlaying, setIsPlaying] = useState(false);

    const Icon = isPlaying ? FaPause : FaPlay;

    const wavesurferRef = useRef(null);

    useEffect(() => {
        wavesurferRef.current = WaveSurfer.create({
            container: '#waveform',
            waveColor: 'white',
            progressColor: 'gray',
            cursorColor: 'transparent',
            barWidth : 3,
            barRadius : 4,
            barGap : 3,
            autoCenter : true,
            height : "auto",
            width : "auto"
        });
  
        wavesurferRef.current.load(url);

        wavesurferRef.current.on('finish', () => {
            setIsPlaying(false);
        });
  
        return () => {
            wavesurferRef.current.destroy();
            setIsPlaying(false);
        };
    }, [url]);

    const handleMediaControl = () => {
        if(isPlaying){
            setIsPlaying(false);
            wavesurferRef.current.pause();
        }else{
            setIsPlaying(true);
            wavesurferRef.current.play();
        }
    }

    return (
        <div className="h-full w-64 mt-2 flex items-center px-3 gap-x-4">
            <Icon
                onClick={handleMediaControl}
                className="text-white h-5 w-5 cursor-default md:cursor-pointer"
            />
            <div id="waveform" className="h-8 w-full"/>
        </div>
    );
}
