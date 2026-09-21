import { io } from "./server";

io.on('connection', (socket)=>{
    console.log('calling peer connected : ', socket.id)
})