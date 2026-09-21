import express from 'express'
import {Server} from 'socket.io'
import cors from 'cors'
import {createServer} from 'http'
import { configDotenv } from 'dotenv'
import tokenRefreshRouter from './routes/refreshToken.js'
import router from './routes/auth.js'
import chatRouter from './routes/chat.js'
import userRouter from './routes/users.js'
import {authenticateToken} from './middlewares/authenticate.js'
import { authenticateSocketToken } from './middlewares/authenticateSocket.js'
import {v4 as uuidv4} from 'uuid'
import {  saveMessageToDb, createConversation } from './utils.js'
import { conversations, messages } from './db/db.js'

configDotenv()

const app = express()
const http = createServer(app) 
export const io = new Server(http, {
    cors : {
        origin : ['http://localhost:5173']
    }
})
app.use(cors())
app.use(express.urlencoded({extended : true}))
app.use(express.json())

// middlewres
app.use('/auth', router)
app.use('/refresh-token', tokenRefreshRouter)
app.use('/chat',  authenticateToken, chatRouter)
app.use('/users', authenticateToken, userRouter)

// socket middlewares
io.use(authenticateSocketToken)
io.on('connection', (socket)=>{
    console.log('socket ', socket.id, ' connected')

    socket.on('userJoin', (data)=>{
        const roomId = data.roomId
        socket.roomId = roomId
        socket.join(roomId)
        console.log(data, ' client data on join')
     
     const room = io.sockets.adapter.rooms.get(data.roomId)
     console.log('👥 Members count:', room?.size || 0)
    
        socket.broadcast.to(roomId).emit('userJoined', {from : socket.user.userId, to  : data.roomId})
    })

    let createdConversation = null;
    let savedMessage = null;

    socket.on('newMessage', (newMessage)=>{
        
         console.log(newMessage, ' NEW MESSAGE')
        const foundConversationIndex =  conversations.findIndex(c => (c.peer1 === newMessage.from && c.peer2 === newMessage.to) || (c.peer2 === newMessage.from && c.peer1 === newMessage.to))

        if(foundConversationIndex !== -1) {   
          const existingConversation = conversations[foundConversationIndex]

          existingConversation.lastMessageId = uuidv4()
          existingConversation.lastMesssageAt = new Date()
          console.log('updated conversation ', existingConversation)
          const newMsgId = existingConversation ?  existingConversation?.lastMessageId : null
          console.log('new message id on existing conversation', newMsgId)

          if(newMessage){
              savedMessage = saveMessageToDb(existingConversation?.id,newMsgId,newMessage)
          }

        }else{
            console.log('new conversation should be created')
             createdConversation = createConversation(newMessage)
             console.log('conversatoin created')
             if(newMessage){
                 const newMsgId = createdConversation ?  createdConversation?.lastMessageId  : null
               console.log('new message id on newConversation conversation', newMsgId)
                 
                 savedMessage = saveMessageToDb(createdConversation?.id,newMsgId, newMessage)
             }
        }

        console.log('conversations size ', conversations.length)
        console.log('messages size ', messages.length)
        socket.broadcast.to(socket.roomId).emit('replyMessage', savedMessage)
    })

    // on user typing 
    socket.on('onTypoing', (data)=>{
        socket.broadcast.to(socket.roomId).emit('onTypingevent', {user : data.user})
    })

    // on disconnect 
    socket.on('disconnect', ()=>{
        const leavingMessage = `${socket.user.userId} left the group ${socket.roomId}`
        socket.broadcast.to(socket.roomId).emit('user-leave', leavingMessage)
    })


    // call join
    // socket.on('join-call', (id)=>{
        socket.broadcast.to(socket.roomId).emit('joined-call', socket?.user?.userId)
    // })

    // rejection event
    socket.on('call-reject', ({roomId,rejecterName}) =>{

        console.log('rejector ', roomId, rejecterName)
        socket.broadcast.to(roomId).emit('rejected-call', rejecterName)
    })
})


app.get('/',(req,res)=>{
    res.redirect('/users')
})

const port = process.env.PORT || 3000
http.listen(port, ()=>{
    console.log('running on port ', port)
})