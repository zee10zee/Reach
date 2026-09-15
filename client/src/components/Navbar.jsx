import { Link, useLocation, useNavigate} from 'react-router-dom'
import styles from '../App.module.css'
import { baseUrl } from '../pages/Home'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userStore } from '../store/useStore'
import { api } from '../axios'

const Navbar = () => {
  const queryClient = useQueryClient()
  const {loggedInUser, setLoggedInUser} = userStore()
  const navigate = useNavigate()

  const {isPending, mutate} = useMutation({mutationFn : handleLogout, 
    onSuccess : (data)=>{
      if(data) {
      console.log(data.message, data.leavingUser)
      alert(`${data.message} ${data.leavingUser.firstname}`)
      
    }
    }, 
    onError : (error)=>{
      console.log('some Error logging out', error)
      navigate('/login', {replace : true})
    }, 
    onSettled : ()=>{
      navigate('/login')
      setLoggedInUser(null)
      localStorage.clear()
      sessionStorage.clear()
    }
  })

async function onLogout(e){
    e.preventDefault()
    mutate()
    queryClient.invalidateQueries({queryKey : ['users']})
  }
    async function handleLogout(){
    const jsonToken = localStorage.getItem('accessToken')
    if(!jsonToken) {
      console.log('json token not found')
      throw new Error('json token not found')
    }

    const token = JSON.parse(jsonToken)
     console.log(token,' before logout')

    const {data} = await api.post(`${baseUrl}/auth/logout`,{}, 
      {headers : {
      'Authorization' : `Bearer ${token}`
    }})
    // return console.log(data)
    return data
 
}

  const location = useLocation()
  if(location.pathname.startsWith('/chat')){
    return null
  }

  return (
    <div className={styles.navbar}>
      <div className="left">
        <div className="logo">
            <Link to="/">Home</Link>
        </div>

      </div>
      <div >
        <ul className={styles.navRight}>
          {loggedInUser ? 
           <div className={styles.loginState}>
              <li>
                <Link to={`user/${loggedInUser.id}`}>
                  {loggedInUser.firstname.charAt(0).toUpperCase() + loggedInUser.firstname.slice(1).toLowerCase()}
                </Link>
              </li>
              <li>
                <form onSubmit={onLogout}>
                  <button type='submit'>
                    {isPending ? 'loggin out' : 'Logout'}
                  </button>
                </form>
              </li>
           </div>
          :
           <div className="logoutState">
            <li><Link to='/login'>Log in</Link></li>
             <li><Link to='/signUp'>Sign up</Link></li>
           </div>
          }
        </ul>
      </div>
    </div>
  )
}


export default Navbar
