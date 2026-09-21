import MyFormInput from "./MyFormInput"
import styles from '../App.module.css'
import { userStore } from "../store/useStore"
import {v4 as uuidv4} from 'uuid'
import socket from "../chats/socket"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"


const ChatForm = ({id : roomId, buddyId}) => {
    const { myMessage, setMyMessage, loggedInUser} = userStore()
    const [sendLoading, setSendLoading] = useState(true)
    const queryClient = useQueryClient()
    // handle send message
    async function onSendMessage(e){
        e.preventDefault()

        if(!myMessage || myMessage === ''){
            return console.log('no message has been provided')
        }

        const newMsg = {
        tempId : uuidv4(), text : myMessage, from  : loggedInUser.id, 
         to : buddyId, pending : true, roomId : roomId
       }

       socket.emit('newMessage', newMsg)
       setSendLoading(false)

        await queryClient.setQueryData(['messages', roomId], (old = [])=>{
        return [...old, newMsg]        
      })

      // update the last message preview sidebar
       queryClient.invalidateQueries({queryKey : ['lastMessages']})
       
      //reset the chat input
       setMyMessage('')
    }
  return (
    <div className={styles.chatFormBox}>
      <form className="chatForm" onSubmit={onSendMessage}>
     <MyFormInput 
       type = {'text'}
       placeholder = {'message'}
       value = {myMessage}  
       onChangeFn = {setMyMessage}
    />
      <button 
        disabled = {myMessage.length === 0}
        type='submit'>{'Send'} 
      </button>
    </form>
    </div>
  )
}

export default ChatForm
