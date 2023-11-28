import { SideBarSheet } from "@/components/sidebar";


const AddLayout = ({children}) => {
    return (
        <div className="h-full w-full relative">
            <div className="absolute left-8 top-4 md:hidden">
                <SideBarSheet/>
            </div>
            {children}
        </div>
    );
}

export default AddLayout;