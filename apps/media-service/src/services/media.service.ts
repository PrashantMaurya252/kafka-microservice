import { AppError } from "shared";
import * as mediaRepo from '../repositeries/media.repo'
import { uploadBuffer } from "../utils/storage";
import { convertToPublicAttachment } from "../utils/media.utils";



async function assertTaskAccess(taskId:string,userId:string,role:string){
    const task = await mediaRepo.findTaskAccess(taskId)
    if(!task){
        throw new AppError(404,"Task is not found")
    }

    if(role !== "ADMIN" && task.created_by !== userId){
        throw new AppError(403,"You are not authorized")
    }
}
export async function uploadAttachment(input:{taskId:string,userId:string,role:string,file?:Express.Multer.File}){
    if(!input.file){
        throw new AppError(400,"Image file is required")
    }

    await assertTaskAccess(input.taskId,input.userId,input.role)

    const uplaoded = await uploadBuffer(
        input.file.buffer,
        input.file.mimetype || "image/jpeg"
    )

    const attachments = await mediaRepo.createAttachments({
        taskId:input.taskId,
        imageUrl:uplaoded.imageUrl,
        publicId:uplaoded.publicId,
        uploadedBy:input.userId
    })

    return convertToPublicAttachment(attachments)
}

export async function listAttachments(taskId:string,userId:string,role:string){
    await assertTaskAccess(taskId,userId,role)
    const rows = await mediaRepo.listByTaskId(taskId)

    return rows.map(convertToPublicAttachment)
}