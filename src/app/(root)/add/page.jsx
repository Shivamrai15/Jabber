"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
    HashIcon
} from "lucide-react";

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
            const data = await axios.post("/api/add-friend", {
                email
            });
            toast.success("Friend request has been send");
        } catch (error) {
            toast.error(error.message)
            console.error(error);
        }
    }

    return (
        <section  className="w-full h-full flex flex-col justify-center items-center">
            <div className="flex items-center max-w-xs md:w-96 gap-x-4">
                <div className="h-20 w-20 rounded-full flex justify-center items-center bg-gradient-to-br from-pink-600 to-purple-600">
                    <HashIcon className="h-14 w-14"/>
                </div>
                <div>
                    <p className="text-xl font-semibold">Wanna a friend?</p>
                </div>
            </div>
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
                            { isAdding ? <Spinner/> : "Add friend"}
                        </Button>
                    </form>
                </Form>
            </div>
        </section>
    );
}

export default AddFriend;