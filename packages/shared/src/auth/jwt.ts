import jwt from 'jsonwebtoken'

import type {UserRole,JwtPayload} from './types'

export function signToken(payload:JwtPayload){
    const expiresIn = process.env.JWT_EXPIRES_IN
    const secret = process.env.JWT_SECRET || 'secret'
    return jwt.sign(payload,secret,{expiresIn:expiresIn as jwt.SignOptions["expiresIn"]})
}

export function verifyToken(token:string):JwtPayload{
    const decodeToken = jwt.verify(token,process.env.JWT_SECRET || 'secret' )
    if(typeof decodeToken !== 'object' || typeof decodeToken === null){
        throw new Error("Invalid token payload")
    }
    return {
        userId:decodeToken.userId,
        role:decodeToken.role
    }
}