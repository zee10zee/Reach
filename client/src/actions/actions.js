import { api } from "../axios"
import { getToken, saveToken } from "../lib/utils"
import { baseUrl } from '../pages/Home'

// get user
    export async function getUser(id){

        const token = getToken('accessToken')
        if(!token) throw new Error('token must be there')

       const {data} = await api.get(`${baseUrl}/users/${id}`, {headers : {'Authorization' : `Bearer ${token}`}})

       if(!data) throw new Error('failure fetching a user')

        saveToken('roomId', data.roomId)
        return {user : data.user, roomId : data.roomId }
}

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

