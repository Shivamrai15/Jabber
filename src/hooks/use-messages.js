import { create } from "zustand";

export const useMessages = create((set, get)=>({
    messages : {},
    setInitialMessages : (conversationId, message) => {
        const updatedMessages = {
            [conversationId]: [...message],
        }
        set({ messages : updatedMessages});
    },
    setMessages : (conversationId, message) => {
        const currentMessages = get().messages;
        const existingMessages = currentMessages[conversationId] || [];
        const updatedMessages = {
            ...currentMessages,
            [conversationId]: [...existingMessages, message],
        }

        set({ messages : updatedMessages});
    }
}));