import {Router} from 'express'
import jwt from 'jsonwebtoken'
const tokenRefreshRouter = Router()

tokenRefreshRouter.post('/', (req,res)=>{
    const {refreshToken} = req.body

     console.log('refresh token from user conversatoins ', refreshToken)

    if(!refreshToken) return res.status(401).json('refresh token is required')
            
        try {
        const rftoken_secret_key = process.env.JWT_REFRESH_TOKEN || 'wheneveryousmile?'
        const decoded = jwt.verify(refreshToken, rftoken_secret_key)

        const accToken_secret_key = process.env.JWT_SECRET || 'whatdoyoumean?'

        // generate new access token
        const newAccessToken = jwt.sign({userId : decoded.userId}, process.env.JWT_SECRET || accToken_secret_key, {expiresIn : '1m'})


        const newRefreshToken  = jwt.sign(
            {userId : decoded.userId}, rftoken_secret_key,{expiresIn : '1w'}
        )

        return res.json({
            success : true,
            accessToken : newAccessToken,
            refreshToken : newRefreshToken
        })
    
    } catch (error) {
        console.log(error, ' failure creating a new token')   
        return res.status(401).json({
            error : 'failure creating new token ' + error
        })
    }

})

export default tokenRefreshRouter

