import { createTaskInput } from "../schemas/task.schema";
import * as taskRepo from "../repositories/task.repo"
import { convertToPublicTask } from "../utils/task.utils";
import { AppError } from "shared";


export async function createTask(input:createTaskInput,userId:string){
    const newTask = await taskRepo.createTask({
        title:input.title,
        createdBy:userId
    })

    return convertToPublicTask(newTask)
}

export async function listTasks(userId:string,role:string){
    if(!userId || !role){
        throw new AppError(401,"Missing user identity")
    }

    const tasks = await taskRepo.listTasks({userId,role})
    return tasks.map(convertToPublicTask)
}

export async function singleTask(id:string,role:string,userId:string){
    if(!id){
        throw new AppError(404,"id is required")
    }
    const task = await taskRepo.findSingleTaskById(id)
    if(!task){
        throw new AppError(404,"Task not found")
    }

    if(role !== "ADMIN" && task.created_by !== userId ){
        throw new AppError(403,"You are not authrize")
    }
    return convertToPublicTask(task)
}

export async function deleteTask(id:string,userId:string,role:string){
    if(!id){
        throw new AppError(404,"id is required")
    }

    const task = await taskRepo.findSingleTaskById(id)
    if(!task){
        throw new AppError(404,"Task not found")
    }

    if(role !== "ADMIN" && task.created_by !== userId ){
        throw new AppError(403,"You are not authrize")
    }

    await taskRepo.deleteTaskById(id)

    
    return {id}
}