
import styles from '../App.module.css'

const InCommingCallModal = ({caller, acceptCall, rejectCall}) => {
  return (
    <div className={styles.incommingCallModal}>
      <h4>you have an incomming call from {caller}</h4>
      <div className="buttons">
        <button
           onClick={acceptCall} 
          className="confirmBtn">Answer</button>
        <button
           onClick={rejectCall} 
          className="rejectBtn">Reject</button>
      </div>
    </div>
  )
}

export default InCommingCallModal

