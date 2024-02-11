import { authOptions } from "@/lib/auth";
import { SideBarComponent } from "./_components/sidebar-component";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const DashboardLayout = async({children}) => {

    const session = await getServerSession(authOptions);
    if(!session){
        redirect("/api/auth/signin?callbackUrl=/")
    }

    return (
        <div className="h-full flex w-full">
            <div className="hidden md:block h-full w-full max-w-xs lg:max-w-sm grow border-r border-black bg-neutral-900">
                <SideBarComponent/>
            </div>
            <main className="h-full w-full flex-1">
                {children}
            </main>
        </div>
    )
}

export default DashboardLayout;