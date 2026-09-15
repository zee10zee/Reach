
import {v4 as uuidv4} from 'uuid'

// models
const users = [
    {
    id : 'abc1',
    firstname : 'ali', 
    email : 'ali@gmail.com', 
    messages : [], 
    joinedAt : new Date(), 
},
{
    id : 'abc12',
    firstname : 'abed', 
    email : 'abed@gmail.com', 
    messages : [], 
    joinedAt : new Date(), 
},
{
    id : 'abc123',
    firstname : 'nadim', 
    email : 'nadim@gmail.com', 
    messages : [], 
    joinedAt : new Date(), 
},
{
    id : 'abc1234',
    firstname : 'sahil', 
    email : 'sahil@gmail.com', 
    messages : [], 
    joinedAt : new Date(), 
},
{
    id : 'abc1235',
    firstname : 'qamar', 
    email : 'qamar@gmail.com', 
    messages : [], 
    joinedAt : new Date(), 
}
]

// future messages model
/*
{
    _id: ObjectId,                       // ✅ Auto
    text: String,                        // ✅ Content
    conversationId: String,              // ✅ Room ID
    sender: {                            // ⚠️ Consider object
        _id: String,
        name: String,                    // Denormalized for speed
    },
    // OR keep simple:
    senderId: String,                    // ✅ Just the ID
    
    sentAt: { type: Date, default: Date.now },
    updatedAt: Date,                     // ✅ For edits
    
    // ✅ ADD these:
    readBy: [String],                    // User IDs who read it
    isDelivered : boolean,
    isRead : boolean, 
    attachments: [{                      // Optional files/media
        url: String,
        type: String,                    // 'image' | 'file'
        name: String,
    }],
    deletedAt: Date,                     // Soft delete
}
*/

/*
mid : 
text : 
conversationId : 
sender : 
sentAt : 
updatedAt : 


*/
export const messages = []
export const conversations = []
export const tokens = []
export const refreshTokens = []
export const currentUser = {}

export default users
