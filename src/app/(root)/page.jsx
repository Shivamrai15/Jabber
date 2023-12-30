import { SideBarSheet } from "@/components/sidebar";
import Image from "next/image";

const RootPage = () => {
    return (
        <div className="w-full h-full flex flex-col justify-center items-center relative">
            <div className="absolute left-8 top-5 md:hidden">
                <SideBarSheet/>             
            </div>
            <Image
                height={80}
                width={80}
                alt="Logo"
                src = "/images/logo-dark.png"
            />
            <h1 className="mt-6 text-5xl md:text-7xl font-extrabold drop-shadow-[0px_0px_5px_rgba(165,250,248)]">Jabber</h1>
            <h3 className="text-zinc-400 text-xs mt-4">The ultimate solution of conversation</h3>
        </div>
    )
}

export default RootPage;