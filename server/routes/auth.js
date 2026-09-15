
import { Router } from "express";
import express from 'express'
import users, { refreshTokens, tokens } from "../db/db.js";
import jwt from 'jsonwebtoken'
import { configDotenv } from "dotenv";
import { authenticateToken } from "../middlewares/authenticate.js";

configDotenv()


const router = Router()
console.log(process.env.JSWT_SECRET)
router.use(express.json())
router.use(express.urlencoded({extended : true}))

router.get('/', (req,res)=>{
    res.redirect('/login')
})

router.get('/login', (req,res)=>{
    res.send('login page')
})

router.post('/login', (req,res)=>{
    const {firstname, email} = req.body

    if(!firstname || !email) return res.json({message : 'fields are required '})

        console.log(firstname)
    const loginUser = users.find(user => user.firstname === firstname.toLowerCase().trim() && 
           user.email === email.toLowerCase().trim())
    
    if(!loginUser) return res.status(501).json({
        success : false,
        message : 'you aint registered'
    })

    // creating a token
    const accessToken = jwt.sign({userId : loginUser.id}, process.env.JWT_SECRET || 'whatdoyoumean?', {expiresIn : '1w'} )

    // creating a refresh token 
    const refreshToken = jwt.sign({userId : loginUser.id}, process.env.JWT_REFRESH_TOKEN || 'wheneveryousmile?', 
        {expiresIn : '1w'}
    )

    // save it to db
    tokens.push({userId : loginUser.id, token : accessToken})

    refreshTokens.push({userId : loginUser, token : refreshToken, expiredAt : new Date(new Date(7 * 24 * 60 * 60 * 1000))})

    res.json({
        isAuthenticated : true,
        loginUser : loginUser, 
        accessToken, 
        refreshToken
    })
})
router.post('/logout', authenticateToken, (req,res)=>{

    try {
        const token = req.headers.authorization.split(' ')[1]

        console.log('logout token ', token, req.user)
        if(!token){
            return res.status(401).json({
                message : 'no token found, so logout', 
            })
        }

        const leavingUser = users.find(user => user.id === req.user.userId)
        
        console.log(leavingUser, ' eaving user')
        return res.json({
            message : 'success logout', 
            leavingUser : leavingUser || 'unknown' 
        })

    } catch (error) {
        console.log('failure loggin out', error)
    }
})


export default router