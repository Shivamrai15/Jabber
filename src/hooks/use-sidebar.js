import { create } from "zustand";

export const useSidebar = create((set)=>({
    isOpen : false,
    onOpen : () => set({ isOpen : true}),
    onClose : () => set({ isOpen : false}),
}));