
import styles from "../App.module.css" 
import {useQuery} from '@tanstack/react-query'
import UserList from "../components/UserList"
import { useNavigate } from "react-router-dom"
import { formatDate, getToken } from "../lib/utils.js"
import { useEffect } from "react"
import { api } from "../axios.js"

export const baseUrl = 'http://localhost:3000'

export function Home(){
const navigate = useNavigate()

useEffect(() => {
        const token = getToken('accessToken');
        if (!token) {
             alert('Token is expired')
            navigate('/login', { replace: true });
        }
    }, [navigate]);


 async function fetchUsers(){

    const token = getToken('accessToken')
    try {
      const {data} = await api.get(baseUrl + '/users', {
      headers : {
        'Authorization' : `Bearer ${token}`
      }
    })
    return data.users
    } catch (error) {
      if(error.response.data.code === 'EXPIRED_TOKEN'){
           console.log(error, ' token expired')
      }
    }
 }

 const {data:users, isPending, isError, error} = useQuery({
    queryKey : ['users', ], 
    queryFn : fetchUsers
 })

  return (
       
      <>
      
      <div className={styles.usersContainer}>
        {
        isError ? (<p>{error?.message}</p>)  : 
        isPending ? (<p>Loading ...</p>) : 
        users.map(user => (
            <UserList key={user.id} user ={user} />
        ))
       }
      </div>
      </>
  )
}
