import { useCallback, useEffect, useRef, useState } from 'react'
import styles from '../App.module.css'
import Message from './Message'
import socket from '../chats/socket'
import { loadConversation } from '../actions/actions'
import {useQuery, useQueryClient } from '@tanstack/react-query'
import { userStore } from '../store/useStore'
const MessageArea = ({roomId}) => {
    const queryClient = useQueryClient()
    const {setMessages, messages} = userStore()


    const [typingMessage, setTypingMessage] = useState(null)
    const typingTimeoutRef = useRef(null)
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
        socket.on('onTypingevent', handleOnTyping)
        // cleanups
        return ()=>{
          socket.off('onTypingevent', handleOnTyping)
        } 
      }, [handleOnTyping])
      
      socket.on('replyMessage', (msg)=>{
        console.log('message received ', msg)
        queryClient.invalidateQueries({queryKey : ['messages', roomId]})
      })
      
        
  const {data : loadedMessages} = useQuery({
    queryKey : ['messages', roomId], 
    queryFn : loadConversation, 
    enabled : !!roomId,
    staleTime : 5 * 60 * 1000, 
  })

  // setMessages(loadedMessages)
  console.log(Array.isArray(messages))

  return (
       <div className={styles.messageBox}>

        {/* {isError ? <p>{error.message}</p> : 
        
         isPending ? <p>Loading messages ...</p> :  */}

         {messages.length === 0 ? <p>No conversation yet !</p> : 
         messages.map(message => (
            <Message 
              key={message?.id} 
              message={message}
            />
        ))
        }
        
        {typingMessage && <p>{typingMessage}</p>}
        
      </div>
  )
}

export default MessageArea
