"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Image from "next/image"

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";
import { Spinner } from "@/components/spinner";

 
const formSchema = z.object({
  email: z.string().email(
    {message : "Invalid Email"}
  ),
});


const AddFriend = () => {

    const [isAdding, setIsAdding] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
          email: "",
        },
    });

    const onSubmit = async({email})=>{
        try {
            setIsAdding(true)
            const data = await axios.post("/api/add-friend", {
                email
            });
            toast.success("Friend request has been send");
        } catch (error) {
            toast.error(error.message)
            console.error(error);
        } finally{
            setIsAdding(false);
        }
    }

    return (
        <section  className="w-full h-full flex flex-col items-center">
            <div className="flex items-center translate-y-28 text-4xl font-extrabold text-zinc-300">
                Wanna a friend ?
            </div>
            <Image 
                    height={250}
                    width={250}
                    src="/images/panda.png"
                    alt="image"
                    className="z-10 translate-y-[127px]"
            />
            <div className="mt-12 pt-8 max-w-xs md:w-96 rounded-lg p-5 bg-neutral-900">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        className = "w-full h-10 bg-neutral-900 border border-zinc-500 outline-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-200 placeholder:text-zinc-600"
                                        placeholder="your@email.com" {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className = "w-full text-zinc-600">
                            { isAdding ? <Spinner/> : "Send Request"}
                        </Button>
                    </form>
                </Form>
            </div>
        </section>
    );
}

export default AddFriend;