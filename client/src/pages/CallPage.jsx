import { useNavigate, useParams } from 'react-router-dom'
import { userStore } from '../store/useStore'
import { useContext, useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getUser } from '../actions/actions'
import { CallContext } from '../context/usePeerContext'
import socket from '../chats/socket'

const CallPage = () => {
  const {id:roomId} = useParams()
  const {loggedInUser} = userStore()
  const ids = roomId ? roomId.split('_') : null
  const peerId = ids[0] === loggedInUser.id ? ids[1] : ids[0]
  const navigate = useNavigate()
  const [isCalling, setIsCalling] = useState(false)
  const mystreamRef = useRef(null)

  const {myPeerRef,activeCall, setActiveCall, myStream, getMyStream, remoteStreamRef} = useContext(CallContext)

  const {data:peerUser, isPending} = useQuery({
    queryKey : ['users', peerId], 
    queryFn  : ()=> getUser(peerId), 
    enabled : !!peerId,
    staleTime : 5 * 60 * 1000
  })

  useEffect(() => {
    let cancelled = false

    // ✅ Guard — don't proceed if peer or stream ready
    if (!myPeerRef.current?.open) {
        console.log('Peer not ready yet')
        return
    }

    async function handleOutgoingCall() {
        try {
            const stream = myStream || await getMyStream()

            if (cancelled) return

            mystreamRef.current = stream

             if (activeCall) {
                console.log('📞 Already in a call (callee) — skipping outgoing call')
                setIsCalling(false)
                return
            }

            const call = myPeerRef.current.call(peerId, stream)
            setIsCalling(true)
            if (!call) return console.error('Call failed')

            setActiveCall(call)

            call.on('stream', (remoteStream) => {
                console.log('remote active:', remoteStream.active)
                console.log('audio tracks:', remoteStream.getAudioTracks())
                console.log(
                  'audio enabled:',
                  remoteStream.getAudioTracks()[0]?.enabled
                )
                setIsCalling(false)
                console.log(remoteStream)
                if (remoteStreamRef.current) {
                  remoteStreamRef.current.srcObject = remoteStream

                  remoteStreamRef.current
                    .play()
                    .catch(err => console.error('Audio play failed:', err))
                }
            })

            call.on('close', () => {
                console.log('📴 Call ended')
                setIsCalling(false)
                setActiveCall(null)
                navigate(-1)
                call.close()
            })
        } catch (err) {
            console.error('Call setup failed:', err)
        }
    }

    handleOutgoingCall()

    const handleCallReject = (id) =>{
      navigate(-1)
    }

            socket.on('rejected-call', handleCallReject)

    return () => {
        cancelled = true
        setIsCalling(false)
        socket.off('rejected-call', handleCallReject)
    }
}, [peerId])   // ✅ Only run when peerId changes

  // call hangup
  function hangupCall(){
    if(!mystreamRef.current) return 
    setIsCalling(false)
    activeCall?.close()
    // mystreamRef.current?.getTracks().forEach(t => t.stop())
    navigate(-1)
  }

  return (
    <div>
      <h1>Call Page </h1>
      <div className="container">
        <h3>  
            { isPending  ? <p>Loading peer name</p> : 
              peerUser?.user?.firstname
            }

            {isCalling && <p>Calling ...</p> }
           
             <audio
              ref={remoteStreamRef}
              autoPlay
              playsInline
              controls
             />
            
        </h3>

        <button 
          onClick={()=> hangupCall()}
          className="hangup">Hang Up</button>
      </div>
    </div>
  )
}

export default CallPage
