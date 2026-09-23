import {Request,Response,NextFunction} from 'express'
import { AppError } from '../errors/AppError'


export function gatewayAuth(req:Request,res:Response,next:NextFunction){
    const expected = process.env.GATEWAY_SECRET
    if(!expected){
        next(new AppError(500,"Gate secret not configured"))
    }

    const incoming = req.header("x-gateway-secret")

    if(!incoming || incoming !== expected){
        return next(new AppError(403,"Forbidden"))
    }

    next()
}