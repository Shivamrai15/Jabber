"use server";

export async function fetchRedis (command, ...args) {

    const commandUrl = `${process.env.UPSTASH_REDIS_REST_URL}/${command}/${args.join('/')}`;

    const restResponse = await fetch(commandUrl , {
        headers : {
            Authorization : `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
        },
        cache : "no-store"
    });

    if(!restResponse.ok){
        throw new Error(`Error executing Redis command : ${restResponse.statusText}`)
    }

    const data = await restResponse.json();
    return  data.result;
}