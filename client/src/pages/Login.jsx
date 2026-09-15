import { userStore } from "../store/useStore"
import { baseUrl } from "./Home"
import { useNavigate } from "react-router-dom"
import { saveToken } from "../lib/utils"
import { api } from "../axios"

export function Login(){
  const navigate = useNavigate()

  const {firstname, email, setFirstname, setEmail, setLoggedInUser} = userStore()
  
  async function onSubmit(e){
    e.preventDefault()
    console.log('submitting ', email, firstname)

    if(!firstname || !email) return alert('all firelds are required !')

    const data = await handleLogin()
    if(data.success === false) return alert(data.errorMsg)

     const token = data.accessToken
     const refreshToken = data?.refreshToken

     if(token !== undefined) { 
        saveToken('accessToken', token)
        saveToken('refreshToken', refreshToken)
        saveToken('loggedInUser', data.loginUser)
      }
      setLoggedInUser(data.loginUser)
      navigate('/')
  }

  async function handleLogin(){
     
    try {
      const {data} = await api.post(`${baseUrl}/auth/login`, 
        {firstname, email}
    )
    if(!data) throw new Error('no data found on login ')

    return data
    } catch (error) {
      
      // if(error.response.data.status)
      console.log(error.response, ' error resonse')
      return {success : false, errorMsg : error.response.data.message}

      
    }
  }

  return (
    <div>
     <form onSubmit={onSubmit}>
      <input 
         value={firstname}
        onChange={(e)=> setFirstname(e.target.value)}
        type="text"
        placeholder="enter your firstname" 
       />
       <input 
        value={email}
        onChange={(e)=> setEmail(e.target.value)}
        type="text"
        placeholder="enter your email" 
       />
       <button type="submit">Log in</button>

     </form>
    </div>
  )
}
