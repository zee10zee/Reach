import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../routes'
import styles from '../App.module.css'
import { userStore } from '../store/useStore'
import { MessageCircle, Phone } from 'lucide-react'

const CallSection = ({user, roomId}) => {
  console.log(roomId, ' roomId')
    const navigate = useNavigate()
    const {loggedInUser} = userStore()
    console.log(!user.id, !loggedInUser.id)
    if(!user.id || !loggedInUser.id) throw new Error('either user id or login user id is undefined')
    
  return (
    <div className={styles.userHeader}>
        <button  className="call"><Phone size={15} /></button>
        <button onClick={()=> navigate(ROUTES.CHAT(roomId))}
          className="messageBtn"><MessageCircle size={15} />
        </button>
    </div>
  )
}

export default CallSection
