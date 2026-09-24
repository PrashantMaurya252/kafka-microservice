import { createTaskInput } from "../schemas/task.schema";
import * as taskRepo from "../repositories/task.repo"
import { convertToPublicTask } from "../utils/task.utils";


export async function createTask(input:createTaskInput,userId:string){
    const newTask = await taskRepo.createTask({
        title:input.title,
        createdBy:userId
    })

    return convertToPublicTask(newTask)
}