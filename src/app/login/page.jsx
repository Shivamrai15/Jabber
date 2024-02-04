"use client";

import { useState } from "react";
import Image from "next/image"
import { signIn } from "next-auth/react"
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { BsGithub, BsGoogle } from "react-icons/bs";
import { PiChatsTeardrop } from "react-icons/pi";
import { MdOutlineGTranslate } from "react-icons/md";
import { GalleryHorizontalEnd } from "lucide-react";

const Login = () => {

    const [isloading, setIsLoading] = useState(false);

    const loginWithGithub = async () => {
        setIsLoading(true)
        try {
            await signIn('github');
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    const loginWithGoogle = async () => {
        setIsLoading(true)
        try {
            await signIn('google');
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="w-full h-full">
            <div className="w-full p-4">
                <div className="grid md:grid-cols-4 w-full gap-y-6 gap-x-10 mt-16 sm:mt-24 sm:px-6 md:px-16 lg:px-24">
                    <div className="text-xl sm:text-2xl md:text-3xl col-span-1 font-medium text-zinc-200">
                        Jabber Messaging
                    </div>
                    <div className="col-span-3 space-y-4 md:space-y-8">
                        <p className="text-3xl md:text-5xl lg:text-7xl font-bold lg:leading-[5.35rem]">
                            Work doesn't stop, neither does chat.
                        </p>
                        <div className="flex flex-col items-start">
                            <h3 className="text-emerald-400 font-medium">Sign Up for free</h3>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3 max-w-sm">
                            <Button
                                className = "bg-neutral-900 hover:bg-neutral-900/80 h-14 text-white font-semibold rounded-full cursor-default md:cursor-pointer"
                                disabled = {isloading}
                                onClick = { loginWithGoogle }
                            >
                                <BsGoogle className="h-4 w-4 text-white mr-3"/>
                                Google
                            </Button>
                            <Button
                                className = "bg-neutral-900 hover:bg-neutral-900/80 h-14 text-white font-semibold rounded-full cursor-default md:cursor-pointer"
                                disabled = {isloading}
                                onClick = { loginWithGithub }
                            >
                                <BsGithub className="h-4 w-4 text-white mr-3"/>
                                Github
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="w-full mt-14 sm:mt-20 flex justify-center items-center px-4">
                    <Image
                        src = "/images/20286028_6212131.svg"
                        height={800}
                        width={800}
                        alt="Image"
                    />
                </div>
                <div className="mt-14 sm:mt-20 sm:px-6 md:px-16 lg:px-24">
                    <div className="max-w-3xl space-y-2 md:space-y-3">
                        <p className="text-3xl md:text-5xl lg:text-7xl font-bold lg:leading-[5.25rem]">
                            Say goodbye to friction, hello to Jabber collaboration.
                        </p>
                        <p className="text-lg sm:text-xl md:text-2xl text-zinc-400 font-medium">
                            Features like file-sharing, realtime-translation and more let you collaborate your way.
                        </p>
                    </div>
                </div>
                <div className="w-full grid md:grid-cols-3 gap-y-6 gap-x-10 mt-16 sm:mt-36 sm:px-6 md:px-16 lg:px-24">
                    <div className="w-full space-y-8 md:space-y-12">
                        <PiChatsTeardrop className="h-14 w-14 lg:h-20 lg:w-20 text-green-400"/>
                        <div className="flex flex-col space-y-4">
                            <h3 className="text-xl font-medium sm:text-2xl lg:text-3xl">Secure Conversation</h3>
                            <p className="text-lg text-zinc-400">
                                Jabber offers end-to-end encrypted messaging with cutting-edge protocols, safeguarding your communications from unauthorized access and data breaches. Experience the peace of mind that comes with truly secure messaging.
                            </p>
                        </div>
                    </div>
                    <div className="w-full space-y-8 md:space-y-12">
                        <MdOutlineGTranslate className="h-14 w-14 lg:h-20 lg:w-20 text-green-400"/>
                        <div className="flex flex-col space-y-4">
                            <h3 className="text-xl font-medium sm:text-2xl lg:text-3xl">Realtime Translation</h3>
                            <p className="text-lg text-zinc-400">
                                Break language barriers instantly! Jabber offers real-time text translation in English. Chat freely with anyone, regardless of language spoken. Enjoy accurate and natural-sounding translations powered by Microsoft Bing AI.
                            </p>
                        </div>
                    </div>
                    <div className="w-full space-y-8 md:space-y-12">
                        <GalleryHorizontalEnd className="h-14 w-14 lg:h-20 lg:w-20 text-green-400"/>
                        <div className="flex flex-col space-y-4">
                            <h3 className="text-xl font-medium sm:text-2xl lg:text-3xl">File Sharing</h3>
                            <p className="text-lg text-zinc-400">
                                Share documents, photos, and videos seamlessly with friends and colleagues. Add a personal touch with instant voice messages, perfect for quick updates or on-the-go communication. Express yourself freely and add a touch of fun with a wide range of emojis and reactions.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="h-24 md:h-48 w-full bg-neutral-900 clip"/>
            <div className="md:h-24 w-full bg-neutral-900"/>
            <div className="h-[40rem] w-full bg-neutral-900 bg-[url('/images/1539895431.svg')] bg-no-repeat bg-center bg-contain">
                <div className="h-full w-full flex flex-col items-center justify-center px-4 sm:px-6 md:px-16 lg:px-24 space-y-4">
                    <p className="text-3xl md:text-5xl lg:text-7xl font-bold lg:leading-[5.35rem] text-center">
                        Get started for free
                    </p>
                    <p className="text:lg sm:text-xl font-medium text-zinc-400 max-w-md text-center">
                        Additional features, storage, audio-messages, realtime-translation just for free
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;