import { getCurrentUserId } from "@/helpers/getCurrentUserId";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import ChatHeader from "./_components/chat-header";
import { PageLayout } from "./_components/page-layout";

export const revalidate = 0;

export const metadata = {
    title : "Your messages"
}

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
        <div className="w-full fex flex-col h-full bg-[url('/images/chat-bg.png')] bg-contain">
            <ChatHeader
                conversationFriend={conversationFriend}
                conversationId = {conversationId}
            />
            <PageLayout
                initialMessages={initialMessages}
                conversationFriend={conversationFriend}
                conversationFriendId={conversationFriendId}
                conversationId={conversationId}
                currentUserId={currentUserId}
                userName={session?.user?.name}
            />
        </div>
    )
}

export default ConversationPage;