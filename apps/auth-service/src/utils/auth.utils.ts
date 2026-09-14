import { JwtPayload, User } from "../types/auth.types";
import jwt from 'jsonwebtoken'

export function convertToPublicUser(user:User){
    return {
        id:user.id,
        email:user.email,
        name:user.name,
        role:user.role,
        createdAt:user.created_at,
    }
}

export function signToken(payload:JwtPayload){
    const expiresIn = process.env.JWT_EXPIRES_IN
    const secret = process.env.JWT_SECRET || 'secret'
    return jwt.sign(payload,secret,{expiresIn:expiresIn as jwt.SignOptions["expiresIn"]})
}