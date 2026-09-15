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
import { saveMessageToDb } from './utils.js'

configDotenv()

const app = express()
const http = createServer(app) 
const io = new Server(http, {
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

    socket.on('newMessage', (newMessage)=>{
           const savedMessage = saveMessageToDb(newMessage)
            socket.broadcast.to(socket.roomId).emit('replyMessage', savedMessage)
    })

    // on user typing 
    socket.on('onTypoing', (data)=>{
        console.log(data, ' user typing data')
        socket.broadcast.to(socket.roomId).emit('onTypingevent', {user : data.user})
    })

    // on disconnect 
    socket.on('disconnect', ()=>{
        const leavingMessage = `${socket.user.userId} left the group ${socket.roomId}`
        socket.broadcast.to(socket.roomId).emit('user-leave', leavingMessage)
    })
})


app.get('/',(req,res)=>{
    res.redirect('/users')
})

const port = process.env.PORT || 3000
http.listen(port, ()=>{
    console.log('running on port ', port)
})