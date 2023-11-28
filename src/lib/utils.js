import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function conversationIdGenerator(id1, id2){
  const sortedIds = [id1, id2].sort();
  return `${sortedIds[0]}--${sortedIds[1]}`;
}

export const toPusherKey = (key)=>{
  return key.replace(/:/g, '__');
}

export const parseSize = (size) =>{
  const kb_size = (size/1024).toFixed(2);
  if (kb_size < 1024) {
    return `${kb_size} KB`;
  }
  const mb_size = (size/1048576).toFixed(2);
  return `${mb_size} MB`;
}