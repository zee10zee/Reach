import { messages } from "./db/db.js";
import {v4 as uuidv4} from 'uuid'
export function saveMessageToDb(newMsg) {
    const newId = uuidv4();

    const dbMessage = {...newMsg, id : newId, sendAt : new Date()}
    console.log(dbMessage, ' after adding new id')
    messages.push(dbMessage)
    return dbMessage
}