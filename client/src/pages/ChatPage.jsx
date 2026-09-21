import styles from '../App.module.css'
import '../App.css'
import { useParams } from 'react-router-dom'
import { authenticateLocal } from '../lib/utils.js'
import { useQuery } from '@tanstack/react-query'
import socket from '../chats/socket.js'
import {useEffect} from 'react'
import ChatForm from '../components/ChatForm.jsx'
import { getUser } from '../actions/actions.js'
import MessageArea from '../components/MessageArea.jsx'
import { userStore } from '../store/useStore.js'
import CallButton from '../components/CallButton.jsx'
import {handleUserJoin } from '../lib/socketEvents.js'

const ChatPage = () => {
    const {id:roomId} = useParams()
    const {loggedInUser} = userStore()
    const [id1,id2] = roomId.split('_') 
    const buddyId = id1 === loggedInUser.id ? id2 : id1
     // authenticate user locally
    authenticateLocal()

    // socket event functions
   const {data:buddy, isError, isPending} = useQuery({
        queryKey : ['users', buddyId], 
        queryFn : () => getUser(buddyId), 
        enabled : !!buddyId, 
        staleTime : 1000 * 60 * 5 
    })

    // socket Events
    useEffect(()=>{
        socket.on('userJoined', handleUserJoin)
        return ()=> {
            socket.off('userJoined', handleUserJoin)
        }
    }, [])

    // emits
     useEffect(()=>{
        const info = {from : loggedInUser?.id, roomId}
        socket.emit('userJoin', info)
    }, [loggedInUser.id, roomId])

     console.log(buddy, ' buddy or user')

  return (
    <div className={styles.chatMain}>
        <div className={styles.chatHeader}>
       
            <div className="left">
                <p>{isPending ? 'loading username..'  : 
                   isError   ? 'unknown Buddy' : 
                    buddy.user.firstname
                    }
                </p>
              
            </div>
            <CallButton roomId={roomId} />
        </div>
        <div className={styles.chatContainer}>
             <MessageArea roomId ={roomId} buddy = {buddy?.user?.firstname || 'unknow buddy'} />
             <ChatForm 
               id = {roomId} 
               buddyId = {buddyId}
               />
        </div>
    </div>
  )
}

export default ChatPage
