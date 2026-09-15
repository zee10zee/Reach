import { useNavigate } from 'react-router-dom'
import styles from '../App.module.css'
import { Phone,Video} from 'lucide-react'


const CallButton = () => {
    const navigate = useNavigate()

    function handleCall(){
      navigate(`/call/${'fdfdfd'}`)
    }

  return (
    <div className={styles.userHeader}>
        <button
           onClick={handleCall} 
           className = {styles.callButton}>
            {<Video size={15} />}
        </button>
        <button className = {styles.callButton}>{<Phone size={15} />}</button>
    </div>
  )
}

export default CallButton
