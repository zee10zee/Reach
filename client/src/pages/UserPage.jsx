import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { baseUrl } from './Home.jsx'
import styles from '../App.module.css'
import CallSection from '../components/CallSection.jsx'
import { formatDate, getToken, saveToken } from '../lib/utils.js'
import { api } from '../axios.js'

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

      async function getUser(id){

        const token = getToken('accessToken')
        if(!token) throw new Error('token must be there')

       const {data} = await api.get(`${baseUrl}/users/${id}`, {headers : {'Authorization' : `Bearer ${token}`}})

       if(!data) throw new Error('failure fetching a user')

        console.log(data.roomId)
        saveToken('roomId', data.roomId)
        return {user : data.user, roomId : data.roomId }
}

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
