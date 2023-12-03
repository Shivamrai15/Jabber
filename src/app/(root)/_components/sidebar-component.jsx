import { getCurrentUserId } from "@/helpers/getCurrentUserId";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { fetchRedis } from "@/helpers/redis";
import { getFriendsById } from "@/helpers/get-friends-by-id";
import { Sidebar } from "./sidebar";
import { conversationIdGenerator } from "@/lib/utils";

const getLastMessages = async(friends, sessionId)=>{
    const lastMessages = {};
    for(let i = 0; i < friends.length; i++){
        const conversationId  = conversationIdGenerator(friends[i].id, sessionId);
        const lastMessage =  await fetchRedis(
            'zrange',
            `chat:${conversationId}:messages`,
            -1,
            -1
        );
        if(lastMessage.length !== 0){
            lastMessages[conversationId] = JSON.parse(lastMessage[0] || '');
        }
        
    }
    return lastMessages;
}

export const SideBarComponent = async() => {

    const session = await getServerSession(authOptions);

    const sessionId = await getCurrentUserId(session?.user?.email);

    const friends = await getFriendsById(sessionId);

    const unseenRequestCount = (await fetchRedis('smembers', `user:${sessionId}:incoming_friend_request`)).length;
    const lastMessages = await getLastMessages(friends, sessionId);
    
    return (
        <Sidebar
                sessionId = {sessionId}
                initialUnseenRequestCount={unseenRequestCount}    
                friends = {friends}
                lastMessages =  {lastMessages}
        />
    );
}

