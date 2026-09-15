import { useNavigate } from 'react-router-dom'
import styles from '../App.module.css'
import { Phone,Video} from 'lucide-react'


const CallButton = () => {
    const navigate = useNavigate()

  return (
    <div className={styles.userHeader}>
        <button className = {styles.callButton}>{<Video size={15} />}</button>
        <button className = {styles.callButton}>{<Phone size={15} />}</button>
    </div>
  )
}

export default CallButton
