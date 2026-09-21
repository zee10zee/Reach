import users, { conversations, messages } from "./db/db.js";
import {v4 as uuidv4} from 'uuid'
export function saveMessageToDb(conversationId,messageId, newMsg) {

    const dbMessage = {
        id : messageId, 
        text : newMsg.text, 
        from : newMsg.from,
        to : newMsg.to,
        sendAt : new Date(), 
        conversationId : conversationId,
    }

    messages.push(dbMessage)
    return dbMessage
}


//id, created_At, lastMessage, sender, 
export function createConversation(newMsg) {
    const newId = uuidv4();
    const sender = users.find(u => u.id === newMsg.from)
    const newConversation = {
        id :    uuidv4(), 
        peer1 : newMsg.from,
        peer2 : newMsg.to, 
        lastMessageId :  newId, 
        lastMessageAt : new Date(),
        createdAt : new Date()
    }

    console.log('new conversation', newConversation)
    conversations.push(newConversation)
    return newConversation
}