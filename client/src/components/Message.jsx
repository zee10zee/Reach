import { useEffect, useState } from 'react'
import styles from '../App.module.css'
import { userStore } from '../store/useStore'
import { getStoredBuddy } from '../lib/utils'


const Message = ({message}) => {
  const {loggedInUser} = userStore()
  const [buddy, setBuddy] = useState(()=> getStoredBuddy())
  
 
  return (
  <div className={`message ${message.from === loggedInUser.id ? 
    'sender' : 'receiver'}`}>
    <p><span>{message.from === loggedInUser.id ? 'me' : buddy.firstname || 'Buddy'} :  
      </span>{message.text}</p>
  </div>
  )
}

export default Message
