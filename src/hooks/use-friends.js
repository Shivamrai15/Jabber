import { create } from "zustand";

export const useFriends = create((set)=>({
    friends : null,
    setFriends : (friends)=>set({friends})
}));