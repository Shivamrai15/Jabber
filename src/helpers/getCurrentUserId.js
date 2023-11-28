export async function getCurrentUserId( email ){
    const response = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/get/user:email:${email}`, {
        headers : {
            Authorization : `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
        },
        cache : "no-store"
    });

    if (!response.ok){
        throw new Error(`Error : Cannot get current user`);
    }

    const data = await response.json();
    const id = data.result;

    return id;
}