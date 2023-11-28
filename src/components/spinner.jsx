import { cn } from "@/lib/utils"
import { Loader } from "lucide-react";

export const Spinner = ({className}) => {
    return (
            <Loader
                className={cn(
                    "h-5 w-5 text-zinc-400 animate-spin",
                    className
                )}
            />
    );
}
