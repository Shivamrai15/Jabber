"use client";

import { useState } from "react";
import { MessageInput } from "./message-input";
import { Messages } from "./messages";

export const PageLayout = ({
    initialMessages,
    currentUserId,
    conversationId,
    conversationFriendId,
    conversationFriend,
    userName
}) => {

    const [messages, setMessages] = useState(initialMessages);

    return (
        <>
            <Messages
                sessionId={currentUserId}
                chatId={conversationId}
                userName = {userName}
                messages = {messages}
                setMessages = {setMessages}
            />
            <MessageInput
                sessionId = {currentUserId}
                setMessages = {setMessages}
                conversationFriendId = {conversationFriendId}
                conversationId = {conversationId}
                conversationFriend = {conversationFriend}
            />
        </>
    )
}
