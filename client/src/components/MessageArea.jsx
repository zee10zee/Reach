import { useCallback, useEffect, useRef, useState } from 'react'
import styles from '../App.module.css'
import Message from './Message'
import socket from '../chats/socket'
import { loadConversation } from '../actions/actions'
import {useQuery, useQueryClient } from '@tanstack/react-query'
import { replyMessage } from '../lib/socketEvents'
const MessageArea = ({roomId, buddy}) => {
    const queryClient = useQueryClient()
    const [typingMessage, setTypingMessage] = useState(null)
    const typingTimeoutRef = useRef(null)


    console.log('roomID ', roomId)
    const {data : messages, isError, error, isPending} = useQuery({
    queryKey : ['messages', roomId], 
    queryFn : loadConversation, 
    enabled : !!roomId,
    staleTime : 5 * 60 * 1000, 
  })
    
      // on typing function
      const handleOnTyping = useCallback((data)=>{
        setTypingMessage(`${data.user} is typing ...`)

        // if there is a timeout going on , clear it 
        if(typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef)
        }

        // to get the latest and fresh timeout activity
       typingTimeoutRef.current = setTimeout(() => {
          setTypingMessage(null)
        }, 3000);
      }, [])

    // handle socket event
      useEffect(()=>{
        socket.on('replyMessage', (msg) => replyMessage(msg, {roomId, queryClient}))
        socket.on('onTypingevent', handleOnTyping)
        // cleanups
        return ()=>{
          socket.off('onTypingevent', handleOnTyping)
        } 
      }, [handleOnTyping, queryClient, roomId])
      

  console.log(messages, ' messages')

  return (
       <div className={styles.messageBox}>

         {isError ? <p>{error.message}</p> : 
        
         isPending ? <p>Loading messages ...</p> :  

         messages.length === 0 ? <p>No conversation yet !</p> : 
         messages.map(message => (
            <Message 
              key={message.id ? message.id : message.tempId} 
              message={message} buddy = {buddy}
            />
        ))
        }
        
        {typingMessage && <p>{typingMessage}</p>}
        
      </div>
  )
}

export default MessageArea
