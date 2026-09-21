
import {Router} from 'express'
import users, { conversations, messages } from '../db/db.js'

const chatRouter = Router()

//Chat page
chatRouter.get('/messages/:roomId', (req,res)=>{
  const {roomId} = req.params

  const [userId,userId2] = roomId.split('_')
  const buddyId = userId === req.user.userId ? userId2 : userId
  console.log(buddyId, ' buddyID')
  console.log(messages, ' messages')

  const conversationMessages = messages.filter(message => {

    return (message.from === req?.user.userId && message.to === buddyId) || (message.from === buddyId && message.to === req?.user.userId)
  })

     console.log('my messages ', conversationMessages)

  res.json({
    conversationMessages
  })
})

chatRouter.get('/:roomId', (req,res)=>{
  const {roomId} = req.params
  const buddyId = roomId.split('_')[0]

  if(!roomId) throw new Error('no room id found')
  if(!buddyId) throw new Error('no buddyId id provided from params')
  const buddy = users.find(user =>{
     return user.id === buddyId
})

  if(!buddy) return res.status(400).json({error : 'buddy could not be found'})

  return res.json({
     success : true, 
     buddy : buddy
  })
})

// current user conversations

chatRouter.get('/conversations/preview', (req,res)=>{  
     
  if(!conversations) return console.log('converstion is not defined')
  try {

   const userId = req?.user?.userId

    const myConversations =  conversations.filter(c => 
        c.peer1 === userId || c.peer2 === userId
    )

    const lastMessages = myConversations.map(c => {
      const lastMessage = messages.find(m => m.id === c.lastMessageId)
      const buddyId  = lastMessage.from === req.user.userId ? lastMessage.to : lastMessage.from 

      const buddy = users.find(u => u.id === buddyId)?.firstname

      return {...lastMessage, buddy}
    }).sort(()=> -1)


    console.log(lastMessages, ' last messages ')


    return res.json({
      success : true,
      lastMessages
    }) 
    
  } catch (error) {
    console.log('error fetching current user conversations ', error)
    return res.status(400).json({
      error : 'failed while fetch login user conversations' + error
    })
  }

})

export default chatRouter

