import Image from "next/image";
import { SideBarComponent } from "./_components/sidebar-component";

export const metadata = {
    title : "Inbox",
    description : "Tracks your conversations: sender, time, status."
}

const RootPage = () => {
    return (
        <div className="w-full h-full ">
            <div className="h-full hidden md:flex md:flex-col justify-center items-center relative">
                <Image
                    height={80}
                    width={80}
                    alt="Logo"
                    src = "/images/logo-dark.png"
                />
                <h1 className="mt-6 text-5xl md:text-7xl font-extrabold drop-shadow-[0px_0px_5px_rgba(165,250,248)]">Jabber</h1>
                <h3 className="text-zinc-400 text-xs mt-4">The ultimate solution of conversation</h3>
            </div>
            <div className="h-full w-full md:hidden bg-neutral-900 px-3">
                <SideBarComponent/>
            </div>
        </div>
    )
}

export default RootPage;