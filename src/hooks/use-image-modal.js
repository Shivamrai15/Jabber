import { create } from "zustand";

export const useImageModal = create((set)=>({
    isOpen : false,
    data : {},
    onOpen : () => set({ isOpen : true}),
    onClose : () => set({ isOpen : false}),
    setData : (data) => set({data})
}));