"use client";

import { BsGithub } from "react-icons/bs";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { signIn } from "next-auth/react"
import { toast } from "sonner";

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

    return (
        <div className="bg-neutral-900 flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full flex flex-col items-center justify-center max-w-md gap-y-8 rounded-lg">
                <div className="flex flex-col items-center gap-8 mt-10">
                    <Image 
                        src="/images/logo-dark.png"
                        alt="Logo"
                        height={100}
                        width={100}
                    />
                    <h2 className="text-zinc-300 text-center text-xl font-semibold">
                        Sign in to you account
                    </h2>
                </div>
                    <button
                        className = "w-72 h-16 border-[1px] text-white border-zinc-500 rounded-lg flex items-center justify-between px-4 cursor-default md:cursor-pointer hover:bg-neutral-800"
                        type="button"
                        disabled = {isloading}
                        onClick={loginWithGithub}
                    >
                        <BsGithub className="w-10 h-10"/>
                        <span>
                            Github Account
                        </span>
                        <ChevronRight/>
                    </button>
            </div>
        </div>
    );
}

export default Login;