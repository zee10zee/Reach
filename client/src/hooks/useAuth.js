import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { baseUrl } from "../pages/Home"
import axios from "axios"

export function useAuth(){
  const navigate = useNavigate()
    const [isUser, setIsUser] = useState(()=>{
     try {
      const jsonUser = localStorage.getItem('loggedInUser')
      return jsonUser !== null
    } catch (error) {
      console.log('error parsing user data ', error)
      return false
    }
  })
  
  const [loggedInUser, setLoggedInUser] = useState(()=>{
    try {
      const jsonUser = localStorage.getItem('loggedInUser')
    return jsonUser ? JSON.parse(jsonUser) : null
    } catch (error) {
      console.log(error)
      return null
    }
  })

  //logout
  async function logOut(){
    try {
      const data = await handleLogout()
      console.log(data, 'after logout')
      return data
    } catch (error) {
      console.log(error, ' error while logging out ')
    } finally{
      localStorage.clear() 
      sessionStorage.clear()
      navigate('/login')
      setIsUser(false)
      setLoggedInUser(null)
    }
  }

  return {isUser, loggedInUser, logOut}
  }


    async function handleLogout(){
    try {
      const jsonToken = localStorage.getItem('token')
    console.log(jsonToken)
    if(!jsonToken) {
      console.log('json token not found')
      throw new Error('json token not found')
    }

    const token = JSON.parse(jsonToken)
    
    const {data} = await axios.post(`${baseUrl}/auth/logout`,{}, {headers : {
      'Authorization' : `Bearer ${token}`
    }})

    if(!data) throw new Error('Unsuccessful logout')

    console.log(data, ' data')
    return data
  } catch (error) {
    console.log(error, ' failure loggin out')
  }
}