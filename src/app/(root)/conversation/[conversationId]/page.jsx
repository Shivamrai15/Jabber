
import { getCurrentUserId } from "@/helpers/getCurrentUserId";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { Messages } from "./_components/messages";
import { redirect } from "next/navigation";
import { MessageInput } from "./_components/message-input";
import ChatHeader from "./_components/chat-header";

export const revalidate = 0;

async function getChatMessages(chatId){
    try {
        const results = await fetchRedis(
            'zrange',
            `chat:${chatId}:messages`,
            0,
            -1
        );

        const messages = results.map((message) => JSON.parse(message) );
        
        return messages;

    } catch (error) {
        console.error(error);
    }
}

const ConversationPage = async({params}) => {

    const session = await getServerSession(authOptions);

    if(!session){
        redirect("/login");
    }

    const conversationId = params.conversationId;
    const [userId1, userId2] = conversationId.split("--");

    const currentUserId = await getCurrentUserId(session?.user?.email);

    const conversationFriendId = currentUserId === userId1 ? userId2 : userId1;
    const conversationFriend = await db.get(`user:${conversationFriendId}`);

    const initialMessages = await getChatMessages(conversationId);


    return (
        <div className="w-full fex flex-col h-full">
            <ChatHeader
                conversationFriend={conversationFriend}
                conversationId = {conversationId}
            />
            <Messages
                initialMessages={initialMessages}
                sessionId={currentUserId}
                chatId={conversationId}
                userName = {session?.user?.name}
            />
            <MessageInput 
                sessionId = {currentUserId}
                conversationFriendId = {conversationFriendId}
                conversationId = {conversationId}
                conversationFriend = {conversationFriend}
            />
        </div>
    )
}

export default ConversationPage;