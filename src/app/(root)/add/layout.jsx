import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = {
    title : "Connect with new contacts",
    description : "Connect with new contacts: Find by email, send request."
}

const AddLayout = ({children}) => {
    return (
        <div className="h-full w-full relative">
            <div className="absolute left-8 top-4 md:hidden">
                <Link
                    scroll = {false}
                    href="/"
                >
                    <ChevronLeft className="cursor-default" />                    
                </Link>
            </div>
            {children}
        </div>
    );
}

export default AddLayout;