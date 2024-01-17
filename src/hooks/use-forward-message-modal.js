import { create } from "zustand";

export const useForwardMessageModal = create((set)=>({
    isOpen : false,
    forwardMessage : false,
    onOpen : ()=>set({isOpen : true}),
    onClose : ()=>set({isOpen : false}),
    setForwardMessage : (message) => set({ forwardMessage : message })
}));