
 

    export const handleUserJoin = (data)=>{
        console.log(data, ' joining user data')
    }

     // message reply event
    export const replyMessage = (newMsg, {roomId, queryClient})=>{
            console.log('message received from server ', newMsg)
            queryClient.setQueryData(['messages', roomId], (old = [])=>{
              const exist = old.some(msg => msg.id == newMsg.id)
               if(exist){
                 return old.map(message => message.id === newMsg.id ? newMsg : message)
               }
               return [...old, newMsg]
            })
    }
    