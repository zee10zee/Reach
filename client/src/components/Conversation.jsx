import { formatDate } from "../lib/utils"

const Conversation = ({lastMessage}) => {
    console.log(lastMessage, 'conversaiotn')
  return (
    <li className="lastMessage">
        <div className="nameDate">
            <p>{lastMessage?.buddy}</p>
            <p className="date">{formatDate(lastMessage.sendAt)}</p>
        </div>
        
        <div className="message-status">
            <div className="message">
            <p className="text">{lastMessage.text}</p>
        </div>
        <div className="status">online</div>
        </div>
    </li>
  )
}

export default Conversation
