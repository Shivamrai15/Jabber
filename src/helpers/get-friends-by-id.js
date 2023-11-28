import { fetchRedis } from "./redis";

export async function getFriendsById(id){
    const friendIds = await fetchRedis('smembers', `user:${id}:friends`)

    const friends = await Promise.all(
        friendIds.map(async(id)=>{
            const friend = await fetchRedis('get', `user:${id}`);
            const data = JSON.parse(friend);
            return data;
        })
    );

    return friends;
}