import { api } from "../axios"
import { getToken } from "../lib/utils"
import { baseUrl } from '../pages/Home'

export async function getBuddy(id){
   console.log(id, ' id')
        const token = getToken('accessToken')
           if (!token) throw new Error('NO_TOKEN')

         try {
            const {data} = await api.get(`/chat/${id}`, {
            headers : {'Authorization' : `Bearer ${token}`}
        })

        console.log(data, ' chat data')

        if(!data?.buddy) throw new Error('Buddy not found')
        
        localStorage.setItem('chatBuddy', JSON.stringify(data.buddy))
        return data.buddy
         } catch (error) {
            console.error('getBuddy error:', error)
            throw error  // ✅ Re-throw so React Query knows it failed
         }

}


// load messages from db


export async function loadConversation({queryKey}){
    const [_, roomId] = queryKey
    const token = getToken('accessToken')
    if(!token || token === 'undefined') {
        return console.log('token is not defined ')
    }

    if(!roomId || roomId === 'undefined') throw new Error('room id isnt available')
        try {
            const {data} = await api.get(`${baseUrl}/chat/messages/${roomId}`, {headers : {
                'Authorization' : `Bearer ${token}`
            }})
            console.log(data, ' data')
            return data.conversationMessages
        } catch (error) {
            console.log(error)
        }
}

