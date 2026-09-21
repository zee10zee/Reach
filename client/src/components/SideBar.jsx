import { useQuery, useQueryClient } from "@tanstack/react-query"
import { userStore } from "../store/useStore"
import {loadCurrentUserConversations} from '../actions/actions'
import Conversation from "./Conversation"
import { useNavigate } from "react-router-dom"
import socket from "../chats/socket"


const SideBar = () => {
const {loggedInUser} = userStore()
const navigate = useNavigate()
const queryClient = useQueryClient()

  if(!loggedInUser?.id) {
    return navigate('/login')
  }

  // relaod the last messages on component mount
   queryClient.invalidateQueries({queryKey : ['lastMessages']})
  
  // updating the side bar with the new recived message
  socket.on('replyMessage', ()=>{
   queryClient.invalidateQueries({queryKey : ['lastMessages']})
  })

  const {data:lastMessages, isPending, isError, error} = useQuery({
    queryKey : ['lastMessages'], 
    queryFn : loadCurrentUserConversations,
    staleTime : 5 * 60 * 1000
  })

  if(isError) return <p>{error.message}</p>
  

  return (
    <div className='sidebar'>
       <h1>My chats</h1>

       <div className="search-container">
        <input type="text" placeholder='search chats' />
       </div>

       <div className="conversationPreviewContainer">
         <div className="chats-preview-list">
         {isPending ? <p>Loading you conversations ....</p> : 
          lastMessages?.length === 0 ? 

        <h3>NO conversation yet ! </h3> : 
        
        lastMessages?.map(m => (
            <Conversation 
               key = {m?.id} 
               lastMessage={m}    
            />
        ))}
       </div>
       </div>
      
    </div>
  )
}

export default SideBar
