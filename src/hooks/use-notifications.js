import { create } from "zustand";

export const useNotification = create((set)=>({
    unseenNotificationCount : 0,
    setUnseenNotificationCount : (value) => set({unseenNotificationCount : value})
}));