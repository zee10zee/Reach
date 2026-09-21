
import {io} from 'socket.io-client'
import { baseUrl } from '../pages/Home'
import { getToken } from '../lib/utils.js'
import { userStore } from '../store/useStore.js';


// const {loggedInUser}  = userStore()

// if(!loggedInUser?.id) window.location.href = '/login' 

const token = getToken('accessToken');
const socket = io(`${baseUrl}/`, {
    auth : {
       token : token
    }
})

export default socket
