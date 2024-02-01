import { create } from "zustand";
import {  persist, createJSONStorage } from "zustand/middleware";
import Cookies from "js-cookie";


export const useTranslate = create(persist(
    (set, get)=>({
        isTranslate : false,
        setTranslate : () => set({ isTranslate : !get().isTranslate}),
    }), 
    {
        name : "jabber-translate",
        storage : createJSONStorage(()=>localStorage)
    }
));