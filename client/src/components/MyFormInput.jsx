import socket from "../chats/socket"
import { userStore } from "../store/useStore"

const MyFormInput = ({type, placeholder, value, onChangeFn}) => {
  const {loggedInUser} = userStore()


  const handleOnChange = (e)=>{
    console.log(e.target.value)
    socket.emit('onTypoing', {user : loggedInUser.firstname})
     onChangeFn(e.target.value)
  }
  return (
     <input 
         value={value}
         onChange={handleOnChange}
         type={type}
          placeholder={placeholder}
       />
  )
}

export default MyFormInput
