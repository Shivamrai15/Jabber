import { SideBarComponent } from "@/app/(root)/_components/sidebar-component";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";

import { MenuIcon } from "lucide-react";

export const SideBarSheet = () => {
    return (
        <Sheet
            className = "bg-neutral-900 w-full h-full"
        >
            <SheetTrigger className="cursor-default">
                <MenuIcon/>
            </SheetTrigger>
            <SheetContent
                side = "left"
                className = "bg-neutral-900 w-full h-full pt-6 pb-1 px-2"
            >
                <SideBarComponent/>
            </SheetContent>
        </Sheet>
    );
}