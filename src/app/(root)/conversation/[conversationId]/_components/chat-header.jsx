import { SideBarSheet } from "@/components/sidebar";
import { ChatSettings } from "./chat-settings";
import { UserProfile } from "@/components/user-profile";

const ChatHeader = ({conversationFriend, conversationId}) => {

    return (
        <div className="flex items-center justify-between w-full h-16 bg-neutral-900 px-4 md:px-8 border-b border-black">
            <div className="flex items-center gap-x-4">
                <div className="md:hidden">
                    <SideBarSheet/>
                </div>
                <UserProfile user={conversationFriend}/>
                <div className="flex flex-col w-full truncate cursor-default">
                    <p className="text-zinc-200 font-medium text-sm">{conversationFriend.name}</p>
                    <p className="text-zinc-500 text-xs">{conversationFriend.email}</p>
                </div>
            </div>
            <div className="flex justify-center items-center md:cursor-pointer">
                <ChatSettings
                    conversationId = {conversationId}
                />
            </div>
        </div>
    );
}

export default ChatHeader;