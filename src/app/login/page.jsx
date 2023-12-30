"use client";

import { BsGithub, BsGoogle } from "react-icons/bs";
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
        <div className="bg-neutral-900 flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full flex flex-col items-center justify-center max-w-md gap-y-8 rounded-lg bg-opacity-40 bg-black">
                <div className="flex flex-col items-center gap-8 mt-10">
                    <Image 
                        src="/images/logo-dark.png"
                        alt="Logo"
                        height={100}
                        width={100}
                    />
                    <div>
                        <h2 className="text-zinc-300 text-center text-2xl font-extrabold">
                            Welcome Back
                        </h2>
                        <p className="text-zinc-400 text-sm text-center">
                            Log in to your account
                        </p>
                    </div>
                </div>
                    <div className="flex flex-col gap-y-2 justify-center items-center mb-10">
                        <button
                            className = "bg-neutral-900 w-72 h-16 border-[1px] text-white border-zinc-500 rounded-lg flex items-center justify-between px-4 cursor-default md:cursor-pointer hover:bg-neutral-800"
                            type="button"
                            disabled = {isloading}
                            onClick={loginWithGoogle}
                        >
                            <BsGoogle className="w-8 h-8"/>
                            <span>
                                Google Account
                            </span>
                            <ChevronRight/>
                        </button>
                        <button
                            className = "bg-neutral-900 w-72 h-16 border-[1px] text-white border-zinc-500 rounded-lg flex items-center justify-between px-4 cursor-default md:cursor-pointer hover:bg-neutral-800"
                            type="button"
                            disabled = {isloading}
                            onClick={loginWithGithub}
                        >
                            <BsGithub className="w-8 h-8"/>
                            <span>
                                Github Account
                            </span>
                            <ChevronRight/>
                        </button>
                    </div>
            </div>
        </div>
    );
}

export default Login;