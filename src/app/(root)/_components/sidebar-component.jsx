import { getCurrentUserId } from "@/helpers/getCurrentUserId";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { fetchRedis } from "@/helpers/redis";
import { getFriendsById } from "@/helpers/get-friends-by-id";
import { Sidebar } from "./sidebar";

export const SideBarComponent = async() => {

    const session = await getServerSession(authOptions);

    const sessionId = await getCurrentUserId(session?.user?.email);

    const friends = await getFriendsById(sessionId);

    const unseenRequestCount = (await fetchRedis('smembers', `user:${sessionId}:incoming_friend_request`)).length;
    
    return (
        <Sidebar
                sessionId = {sessionId}
                initialUnseenRequestCount={unseenRequestCount}    
                friends = {friends}     
        />
    );
}

