import { getCurrentUserId } from "@/helpers/getCurrentUserId";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { ChevronLeft } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { FriendRequests } from "../_components/friend-requests";


const NotificationPage = async() => {

    const session = await getServerSession(authOptions);

    const sessionId = await getCurrentUserId(session?.user?.email);

    const incomingRequestIds = await fetchRedis('smembers', `user:${sessionId}:incoming_friend_request`);

    const incomingFriendRequests = await Promise.all(
        incomingRequestIds.map(async(senderId) => {
            const sender = await fetchRedis('get', `user:${senderId}`);
            const data = await JSON.parse(sender)
            return data;
        })
    );

    return (
        <div className="h-full w-full overflow-y-auto">
            <div className="h-16 w-full z-50 flex items-center bg-neutral-900 px-4 md:px-8 sticky top-0">
                <div className="md:hidden flex items-center justify-center mr-5">
                    <Link
                        scroll = {false}
                        href="/"
                    >
                        <ChevronLeft className="cursor-default" />
                    </Link>
                </div>
                <h2 className="text-white font-semibold text-sm">
                    Notifications
                </h2>
            </div>
            <div
                className="w-full flex justify-center"
            >
                <FriendRequests
                    incomingFriendRequests = {incomingFriendRequests}
                    sessionId = {sessionId}
                />
            </div>
        </div>
    )
}

export default NotificationPage;