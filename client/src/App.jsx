import {Routes, Route, BrowserRouter} from 'react-router-dom'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import Navbar from './components/Navbar'
import UserPage from './pages/UserPage'
import ChatPage from './pages/ChatPage'
import { ROUTES } from './routes'
import CallPage from './pages/CallPage'
import { CallProvider } from './context/usePeerContext'
import AuthLayout from './layouts/AuthLayout'
import MainLayout from './layouts/MainLayout'
import ChatLayout from './layouts/ChatLayout'
const App = () => {
  return (
    <>
        <Routes>
          {/* auth layouts */}
          <Route element = {<AuthLayout />}>
            <Route path={ROUTES.LOGIN} element = {<Login />} />
          </Route>

          {/* chat and call layouts */}
          <Route element = {<ChatLayout />}>
             <Route path={ROUTES.CALL(':id')} element = {<CallPage />} />
          </Route>

          {/* main layouts */}
          <Route element = {<MainLayout />} >
            <Route path={ROUTES.HOME} element = {<Home />} />
            <Route path={ROUTES.USER(':id')} element = {<UserPage />} />
             <Route path={ROUTES.CHAT(':id')} element = {<ChatPage />} />
          </Route>  
        </Routes>
      </>
  )
}



export default App
