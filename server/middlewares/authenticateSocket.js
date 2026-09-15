
import jwt from 'jsonwebtoken'
export function authenticateSocketToken(socket,next){

    const token = socket.handshake.auth.token

    if(!token) return next(new Error('NO token found'))
     
    try{
        const decoded = jwt.verify(token, 'whatdoyoumean?')
        socket.user = decoded
        next()
    } catch (error) {
        console.log('socket auth failed ' ,error.message)
        return next(new Error(error.name === 'TokenExpiredError' ? 'TOKEN_EXPIRED' : 'INVALIDE_TOKEN'))

    }
}
