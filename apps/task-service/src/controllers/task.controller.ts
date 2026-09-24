import type{Request,Response,NextFunction} from 'express'
import * as taskService from '../services/task.service'
import { AppError, successResponse } from 'shared'


function requireIdentity(req:Request){
    const userId = req.header("x-user-id")
    const role = req.header("x-user-role")

    if(!userId || ! role){
        throw new AppError(401,"Missing your identity")
    }

    return {userId,role}
}

export async function createTask(req:Request,res:Response,next:NextFunction){
    try {
        const {userId} = requireIdentity(req)
        const task = await taskService.createTask(req.body,userId)
        successResponse(res,{task},201)
    } catch (error) {
        next(error)
    }
}

export async function tasksList(req:Request,res:Response,next:NextFunction){
    try {
        const {userId,role} = requireIdentity(req)
        const tasks = await taskService.listTasks(userId,role)
        successResponse(res,{tasks},200)
    } catch (error) {
        next(error)
    }
}

export async function taskDetails(req:Request,res:Response,next:NextFunction){
    try {
        const {userId,role} = requireIdentity(req)
        const id = String(req.params.id)
        const task = await taskService.singleTask(id,role,userId)
        successResponse(res,{task},200)
    } catch (error) {
        next(error)
    }
}

export async function deleteTask(req:Request,res:Response,next:NextFunction){
    try {
        const {userId,role} = requireIdentity(req)
        const id = String(req.params.id)
        const result = await taskService.deleteTask(id,userId,role)
        successResponse(res,{result},200)
    } catch (error) {
        next(error)
    }
}