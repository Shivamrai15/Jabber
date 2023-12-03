import { create } from "zustand";

export const useLastMessage = create((set, get)=>({
    last_message : {},
    setInitialLastMessages : (messages)=>set({last_message : messages}),
    setLastMessages : (message, id)=>{
        const last_initial_messages = get().last_message;
        const updated_last_messages = {...last_initial_messages, [id] : message}
        set({
            last_message : updated_last_messages
        });
    }
}));