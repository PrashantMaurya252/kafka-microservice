import {Request,Response,NextFunction} from 'express'
import { AppError, verifyToken } from 'shared'
import { getAllowedRoles, isPublicRoute } from '../rbac'

const IDENTITY_HEADERS=[
    "x-user-id",
    "x-user-role",
    "x-gateway-secret"
] as const


function stripIdentityHeaders(req:Request){
    for(const header of IDENTITY_HEADERS){
        delete req.headers[header]
    }
}

function attachGateSecret(req:Request){
    const secret = process.env.GATEWAY_SECRET
    if(!secret){
        throw new AppError(500,"GATEWAY_SECRET is not configured")
    }

    req.headers["x-gateway-secret"] = secret
}

function requestPath(req:Request){
    const combine = `${req.baseUrl}${req.path}`
    if(combine.length > 1 && combine.endsWith("/")){
        return combine.slice(0,1)
    }
    return combine || "/"
}

function attachUserHeaders(req:Request,userId:string,role:string){
    req.headers["x-user-id"] = userId
    req.headers["x-user-role"] = role
}
export function gatewayAuth(req:Request,res:Response,next:NextFunction){
    try {
        stripIdentityHeaders(req)
    attachGateSecret(req)

    const path = requestPath(req)

    console.log("Public route",req.path,path)

    if(isPublicRoute(req.method,path)){
        return next()
    }

    const authHeader = req.header('authorization')
    if(!authHeader?.startsWith('Bearer')){
        throw new AppError(401,"Missing or invalid auth token")
    }

    const token = authHeader.slice("Bearer ".length).trim()

    const payload = verifyToken(token)

    const allowedRoles = getAllowedRoles(req.method,path)
    console.log("AllowedRoles",allowedRoles)

    if(!allowedRoles){
        throw new AppError(404,"Route not found in middleware")
    }

    if(!allowedRoles.includes(payload.role)){
        throw new AppError(403,"Forbidden, You do not have access to this route")
    }

    attachUserHeaders(req,payload.userId,payload.role)
    next()
    } catch (error) {
        if(error instanceof AppError){
            return next(error)
        }
    return next(new AppError(401,"Invalid or expired token"))
    }

    
}

