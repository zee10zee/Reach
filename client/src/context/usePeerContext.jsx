import { createContext, useEffect, useRef, useState } from "react";
import Peer from 'peerjs'
import { userStore } from "../store/useStore";
import InCommingCallModal from "../components/InCommingCallModal";
import { useNavigate } from "react-router-dom";
import socket from '../chats/socket'

export const CallContext = createContext()

export function CallProvider({children}){
  const [myStream, setMyStream] = useState(null)
  const [incommingCall, setIncommingCall] = useState(null)
  const [activeCall, setActiveCall] = useState(null)
  const navigate = useNavigate()
  const myStreamRef = useRef(null)
  const remoteStreamRef = useRef(null)
  const myPeerRef = useRef(null)
  const {loggedInUser} = userStore()

  useEffect(()=>{

    if(!loggedInUser?.id) return navigate('/login')

           let cancelled = false;
            const peer = new Peer(loggedInUser?.id, {
                host: 'localhost',
                port: 9000,
                path: '/',
                secure: false
            })
        
            if(cancelled){
                peer.destroy()
                return 
            } 

            myPeerRef.current = peer

            peer.on('open', (id)=> console.log('peer connection has established', id))

        
            // handling incomming call
            peer.on('call', call => {
                   console.log('📞 ================================')
                    console.log('📞 CALL EVENT FIRED')
                    console.log('📞 From peer:', call.peer)
                    console.log('📞 My peer ID:', peer.id)
                    console.log('📞 My user ID:', loggedInUser?.id)
                    console.log('📞 Same as me?', call.peer === loggedInUser?.id)
                    console.log('📞 ================================')
                setIncommingCall(call)
                //this is where we need to handle the remote stream right ? 
                call.on('stream', remoteStream =>{
                    if(remoteStreamRef.current && remoteStream.active){

                        remoteStreamRef.current.srcObject = remoteStream
                        remoteStreamRef.current
                        .play()
                        .catch(err => console.error('Audio play failed:', err))
                    }
                })
            })
            peer.on('error', (err) => {
                console.error('❌ Peer error:', err)
            })

            
      
       // clean ups
        return (()=>{
            cancelled = true
            myPeerRef.current?.destroy()
            myPeerRef.current = null
        })
    }, [loggedInUser?.id])

    async function getMyStream() { 
        if(myStreamRef.current) return myStreamRef.current
        const stream =  await navigator.mediaDevices.getUserMedia({audio : true})
        myStreamRef.current = stream
        setMyStream(stream)
        return stream
    }

    async function acceptCall(){
        if(!incommingCall) return 
        const myStream = await getMyStream()
        incommingCall.answer(myStream)
        setActiveCall(incommingCall)
        setIncommingCall(null)
        const roomId = [incommingCall.peer, loggedInUser.id].sort().join('_')
        console.log(roomId, 'ROOM ID')
        navigate(`/call/${roomId}`)
    }

    function rejectCall(){
        if(!incommingCall) return 
        // close the modal
        const roomId = [incommingCall.peer, loggedInUser.id].sort().join('_')
        socket.emit('call-reject', {roomId, rejecterName : loggedInUser?.firstname})
        setIncommingCall(null)
    }

   return (
      <CallContext.Provider value={
         {
            myStream, 
            myPeerRef, 
            activeCall, 
            setActiveCall,
            incommingCall,
            getMyStream, 
            remoteStreamRef
         }}>
        {children}
        {incommingCall && 
           <InCommingCallModal 
               caller = {loggedInUser?.firstname}
               acceptCall = {acceptCall}
               rejectCall = {rejectCall} 
            />}
      </CallContext.Provider>
   )
}