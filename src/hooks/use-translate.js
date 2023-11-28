import { create } from "zustand";
import Cookies from "js-cookie";


export const useTranslate = create((set, get)=>({
    isTranslate : JSON.parse(Cookies.get("translate") || 'false'),
    setTranslate : () => set({ isTranslate : !get().isTranslate}),
}));