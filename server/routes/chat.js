
import {Router} from 'express'
import users, { messages } from '../db/db.js'

const chatRouter = Router()

//Chat page
chatRouter.get('/messages/:roomId', (req,res)=>{
  const {roomId} = req.params
  const conversationMessages = messages.filter(message => {
    return message.conversationId === roomId
  })

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

export default chatRouter

