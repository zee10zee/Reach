
import axios from 'axios'
import { getToken, saveToken } from './lib/utils'

 const baseUrl = 'http://localhost:3000'

export const api = axios.create({
    baseURL : baseUrl
})


api.interceptors.response.use(
    (response)=>{
        console.log('response ', response)
        return response
    }, 
    async (error)=>{
        console.log('error ', error)
        console.log('error config', error.config)
        // if the error status is not 401 , reject it 
        if(error.response.status !== 401 || error.config._retry){
            return Promise.reject(error)
        }

        error.config._retry = true

        const refreshToken = getToken('refreshToken')
        if(!refreshToken) return console.log('acess token not found')

        const newTokens = await getNewToken(refreshToken,error)
        console.log(newTokens)

        saveToken('accessToken', newTokens.newAccToken)
        saveToken('refreshToken', newTokens.newRefToken)

        // update the old accessToken in error headers
        error.config.headers.Authorizations = `Bearer ${newTokens.newAccToken}`

        // resend the failed request with updated access TOKEN  
        return api(error.config)
    }
)

async function getNewToken(refreshToken){
    const {data} = await axios.post(`${baseUrl}/refresh-token`, {refreshToken})
    if(!data) return console.log(' no data response')
    return {newAccToken : data.accessToken, newRefToken : data.refreshToken}
}