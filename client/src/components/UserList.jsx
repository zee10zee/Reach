
import { useNavigate } from 'react-router-dom'
import styles from '../App.module.css'
import { ROUTES } from '../routes'

const UserList = ({user}) => {
  const navigate = useNavigate()

  return (
    <div
       onClick={() => navigate(ROUTES.USER(user.id))} 
       className={styles.userContainer}>
      <p 
        className={styles.username}>
          {user.firstname}
      </p>
      <p 
         className={styles.username}>
          {user.email}
      </p>
    </div>
  )
}

export default UserList
