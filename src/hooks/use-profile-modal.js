import {create} from "zustand";

export const useProfileModal = create((set)=>({
    isOpen : false,
    profileData : null, 
    onOpen : ()=>set({isOpen:true}),
    onClose : ()=>set({isOpen : false}),
    setProfileData : (data)=>set({
        profileData : data
    })
}));