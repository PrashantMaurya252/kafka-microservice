import type {Request,Response,NextFunction} from 'express'
import { AppError, successResponse } from 'shared'
import * as mediaService from '../services/media.service'


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
        const attachment = await mediaService.uploadAttachment({taskId,userId,role,file:req.file})

        successResponse(res,{attachment},201)
    } catch (error) {
        next(error)
    }
}

export async function listTaskAttachments(req:Request,res:Response,next:NextFunction){
    try {
        const {userId,role} = requireIdentity(req)
        const taskId = String(req.params.taskId)
        const extractAttachments = await mediaService.listAttachments(taskId,userId,role)
        successResponse(res,{extractAttachments},200)
    } catch (error) {
        next(error)
    }
}