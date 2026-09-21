import Navbar from '../components/Navbar'
import SideBar from '../components/SideBar'
import { Outlet } from 'react-router-dom'
import { CallProvider } from '../context/usePeerContext'
import '../App.css'

const MainLayout = () => {
  return (
   <>
     <CallProvider>
      <div className="layout">
        <SideBar />
        <div className="main">
          <Navbar />
          <div className="content">
            <Outlet />
          </div>
        </div>
      </div>
     </CallProvider>
   </>
  )
}

export default MainLayout
