import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"

export const ForwardBox = ({
    data,
    setSelectedIds,
    selectedIds
}) => {

    const toggleSelect = () => {
        setSelectedIds((value)=>({
            ...value,
            [data.id] : !selectedIds[data.id]
        }));
        
    }

    return (
        <div className="w-full flex items-center hover:bg-neutral-800/50 rounded-md py-1.5 px-3 gap-x-4 overflow-hidden">
            <div className="flex flex-1 items-center w-full gap-x-4">
                <Avatar className = "h-9 w-9">
                    <AvatarImage src = {data.image}/>
                    <AvatarFallback className="relative h-full w-full">
                        <Image
                            src="/images/avatar.png"
                            fill
                            alt="Profile"
                        />
                    </AvatarFallback>
                </Avatar>
                <p className="text-sm w-52  md:w-72 truncate cursor-default">{data.name}</p>
            </div>
            <div>
                <Checkbox
                    value = {selectedIds[data.id]}
                    onClick = {toggleSelect}
                />
            </div>
        </div>
    )
}
