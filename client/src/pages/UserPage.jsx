import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import styles from '../App.module.css'
import CallSection from '../components/CallSection.jsx'
import { formatDate } from '../lib/utils.js'
import { getUser } from '../actions/actions.js'

const UserPage = () => {
    const {id} = useParams()
    
    const {data:user, isError, error, isLoading} = useQuery({
        queryKey : ['users', id], 
        queryFn : () => getUser(id), 
        enabled : !!id, 
        staleTime : 1000 * 60 * 5 
    })

    if(isLoading) return <p>Loading User ...</p>
    if(isError) return  <p>{error?.message}</p>
    if(!user) return  <p>No User found !</p>

  return (
    <div className={styles.userMainContainer}>
         <CallSection user = {user.user} roomId = {user.roomId}/>

         <div className={styles.userPersonalInfo}>
             <p>name : {user.user.firstname}</p>
            <p>email : {user.user.email}</p>
            <p>joining date : {formatDate(user.user.joinedAt)}</p>
        </div>
    </div>
  )
}



export default UserPage
