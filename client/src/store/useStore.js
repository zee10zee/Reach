
import {create} from 'zustand'
import {createJSONStorage, persist} from 'zustand/middleware'


export const userStore = create(
    persist((set)=> ({
    firstname : '', 
    email : '', 
    setFirstname : (value)=> set({firstname : value}),
    setEmail : (value)=> set({email : value}),
    loggedInUser : null,
    setLoggedInUser : (value) => set({loggedInUser : value}), 
    chatBuddy : null,
    setChatBuddy : (value) => set({chatBuddy : value}), 
    myMessage : '', 
    setMyMessage : (value) => set({myMessage : value}),
    messages : [], 
    setMessages : (newConversation)=> set({messages : newConversation}),
     addMessage  :(newMessage)=> set((state)=> {
        return {messages : [...state.messages , newMessage]}
    }), 
}),
{
    'name' : 'user-persist', 
     'storage' : createJSONStorage(()=> localStorage)
})
)

