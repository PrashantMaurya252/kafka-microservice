import type {Request,Response,NextFunction} from 'express'
import { AppError } from 'shared'


function requireIdentity(req:Request){
    const userId = req.header("x-user-id")
    const role = req.header("x-user-role")

    if(!userId || ! role){
        throw new AppError(401,"Missing your identity")
    }

    return {userId,role}
}

export async function uploadAttachments(req:Request,res:Response,next:NextFunction){
    try {
        const {userId,role} = requireIdentity(req)
        const taskId = String(req.params.taskId)
    } catch (error) {
        next(error)
    }
}