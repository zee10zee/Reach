import {Routes, Route, BrowserRouter} from 'react-router-dom'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import Navbar from './components/Navbar'
import UserPage from './pages/UserPage'
import ChatPage from './pages/ChatPage'
import { ROUTES } from './routes'
const App = () => {
  return (
    <>
      <BrowserRouter>
       <Navbar />
        <Routes>
          <Route path={ROUTES.LOGIN} element = {<Login />} />
          <Route path={ROUTES.HOME} element = {<Home />} />
          <Route path={ROUTES.USER(':id')} element = {<UserPage />} />
          <Route path={ROUTES.CHAT(':id')} element = {<ChatPage />} />
        </Routes>
      </BrowserRouter>      
      </>
  )
}



export default App
