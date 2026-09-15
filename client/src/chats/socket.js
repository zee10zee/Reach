
import {io} from 'socket.io-client'
import { baseUrl } from '../pages/Home'
import { getToken } from '../lib/utils.js'

const token = getToken('accessToken');
const socket = io(`${baseUrl}/`, {
    auth : {
       token : token
    }
})

export default socket
