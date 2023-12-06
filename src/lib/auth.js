import  { UpstashRedisAdapter } from "@auth/upstash-redis-adapter";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { db } from "./db";

export const authOptions  = {
    adapter : UpstashRedisAdapter(db),
    session : {
        strategy : 'jwt',
    },
    pages : {
        signIn : "/login"
    },
    providers : [
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        GoogleProvider({
            clientId : process.env.GOOGLE_ID,
            clientSecret : process.env.GOOGLE_SECRET
        })
    ],
    debug : process.env.NODE_ENV === 'development',
    secret : process.env.NEXT_AUTH_SECRET,
    callbacks : {
        redirect(){
            return '/';
        }
    }
}