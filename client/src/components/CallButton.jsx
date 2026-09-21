import { useNavigate } from 'react-router-dom'
import styles from '../App.module.css'
import { Phone,Video} from 'lucide-react'


const CallButton = ({roomId}) => {
    const navigate = useNavigate()

    function onClickAudioButton(){
      navigate(`/call/${roomId}`)
    }

  return (
    <div className={styles.userHeader}>
        <button
            
           className = {styles.callButton}>
            {<Video size={15} />}
        </button>
        <button
           onClick={onClickAudioButton} 
           className = {styles.callButton}>
            {<Phone size={15} />}
        </button>
    </div>
  )
}

export default CallButton
