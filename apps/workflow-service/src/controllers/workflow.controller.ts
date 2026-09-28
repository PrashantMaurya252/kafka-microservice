import { AppError, successResponse } from "shared"
import type {Request,Response,NextFunction} from 'express'
import * as workflowService from '../services/workflow.service'


function requireIdentity(req:Request){
    const userId = req.header("x-user-id")
    const role = req.header("x-user-role")

    if(!userId || ! role){
        throw new AppError(401,"Missing your identity")
    }

    return {userId,role}
}

export async function listWorkflowByTask(req:Request,res:Response,next:NextFunction){
    try {
        const {userId,role} = requireIdentity(req)
        const taskId = String(req.params.taskId)
        const workFlows = await workflowService.listWorkflowByTask(taskId,userId,role)
        successResponse(res,{workFlows})
    } catch (error) {
        next(error)
    }
}