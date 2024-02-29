import { messageDates } from "@/lib/message-dates";

export const DateDisplay = ({
    timestamp
}) => {

    return (
        <div className = "w-full flex items-center justify-center md:py-4">
            <div className = "px-3 py-1.5 rounded-full bg-neutral-900 text-sm font-semibold cursor-default">
                {
                    messageDates(timestamp)
                }
            </div>
        </div>
    );
}
