
import jwt from 'jsonwebtoken'
export function authenticateToken(req,res,next){
    try {
        const authHeaders = req.headers.authorization

        if(!authHeaders) return res.status(401).json({
            error : 'No headers found'
        })

        const token = authHeaders.split(' ')[1]


    if(!token) return res.status(401).json({error : 'NO token found'})
    
    const decoded = jwt.verify(token, 'whatdoyoumean?')
    req.user = decoded
    next()
    } catch (error) {
        console.log('Error :', error, 'error name : ', error.name)
        return res.status(401).json({code : error.name === 'TokenExpiredError' ? 'EXPIRED_TOKEN' : error.name === 'JsonWebTokenError' ? 'WRONG_CREDENTIALS' :   'INVALID_TOKEN'})  
    }
}