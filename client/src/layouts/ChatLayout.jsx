import { Outlet } from 'react-router-dom'
import { CallProvider } from '../context/usePeerContext'

const ChatLayout = () => {
  return (
    <>
      <CallProvider>
        <Outlet />
      </CallProvider>
    </>
  )
}

export default ChatLayout
