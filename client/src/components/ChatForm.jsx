import MyFormInput from "./MyFormInput"
import styles from '../App.module.css'
import { userStore } from "../store/useStore"
import {v4 as uuidv4} from 'uuid'
import socket from "../chats/socket"
import { useQueryClient } from "@tanstack/react-query"


const ChatForm = ({id : roomId}) => {
    const { myMessage, setMyMessage, addMessages, loggedInUser} = userStore()
    const queryClient = useQueryClient()
    // handle send message
    async function onSendMessage(e){
        e.preventDefault()

        if(!myMessage || myMessage === ''){
            return console.log('no message has been provided')
        }

        const newMsg = {
        id : uuidv4(), text : myMessage, from  : loggedInUser.id, 
        roomId
       }

       socket.emit('newMessage', newMsg, roomId)
       addMessages(newMsg)
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
      <button type='submit'>Send</button>
    </form>
    </div>
  )
}

export default ChatForm
