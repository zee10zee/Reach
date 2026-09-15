

import {Router} from 'express'
import users, { refreshTokens } from '../db/db.js'

const userRouter = Router()

userRouter.get('/', (req,res)=>{

    // console.log(req.headers.authorization)
    const filteredUsers = users.filter(user => user.id !== req.user.userId)

    return res.json({users : req.user ? filteredUsers :  users})
})

// a single user 
userRouter.get('/:userId', (req,res)=>{

    const {userId} = req.params
    console.log(userId, ' params')
    if(!userId) return res.json({message : 'user id not found'});

    const validUser = users.find(user => user.id === userId)
    if(!validUser) return res.json({message  :'user id is not valid'})

    // create room Id
    const roomId = [validUser.id , req.user.userId].sort().join('_')

    return res.json({user :validUser, roomId})
})

export default userRouter