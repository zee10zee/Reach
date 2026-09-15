import styles from '../App.module.css'
import '../App.css'
import { useParams } from 'react-router-dom'
import { authenticateLocal, getStoredBuddy } from '../lib/utils.js'
import { useQuery } from '@tanstack/react-query'
import socket from '../chats/socket.js'
import { useCallback, useEffect, useRef} from 'react'
import ChatForm from '../components/ChatForm.jsx'
import { getBuddy } from '../actions/actions.js'
import MessageArea from '../components/MessageArea.jsx'
import { userStore } from '../store/useStore.js'
import CallButton from '../components/CallButton.jsx'


function handleConnection(){
    return console.log('connected socket is : ', socket.id)
}


const ChatPage = () => {
    const {id} = useParams()
    const {loggedInUser} = userStore()
    const [id1,id2] = id.split('_') 
    const buddyId = id1 === loggedInUser.id ? id2 : id1

    const {data:buddy, isPending} = useQuery({
        queryKey : ['users', buddyId], 
        queryFn : getBuddy, 
        enabled :!!buddyId,
        staleTime : 5* 60 * 1000
    })

    const idRef = useRef(id)
    // authenticate user locally
    authenticateLocal()

    // socket event
      useEffect(()=>{
        socket.on('connect', handleConnection)
        return ()=> socket.off('connect', handleConnection)
    }, [])

    const handleUserJoin = useCallback((data)=>{
        idRef.current = id
       console.log(data, ' joining user data')
    }, [id])
    // user join
    useEffect(()=>{
        socket.on('userJoined', handleUserJoin)
        return ()=> socket.off('userJoined', handleUserJoin)
    }, [handleUserJoin])

    // emits
     useEffect(()=>{
        const info = {from : loggedInUser?.id, roomId : id}
        socket.emit('userJoin', info)
    }, [loggedInUser.id, id])

       console.log(buddy, ' buuddy')
  return (
    <div className={styles.chatMain}>
        <div className={styles.chatHeader}>
       
            <div className="left">
                <p>{buddy.user?.firstname || 'buddy'}</p>
              
            </div>
            <CallButton />
        </div>
        <div className={styles.chatContainer}>
             <MessageArea roomId ={id} />
             <ChatForm id = {id} />
        </div>
    </div>
  )
}

export default ChatPage
