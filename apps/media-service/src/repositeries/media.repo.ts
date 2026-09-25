import { getPool } from "shared";
import { Attachments } from "../types/media.types";


export async function createAttachments(input:{taskId:string,imageUrl:string,publicId:string,uploadedBy:string}):Promise<Attachments>{
    const result = await getPool().query<Attachments>(
        `
        INSERT INTO attachments (task_id, image_url, public_id, uploaded_by)
        VALUES($1,$2,$3,$4)
        RETURNING id task_id, image_url, public_id, uploaded_by, created_at
        `,
        [input.taskId,input.imageUrl,input.publicId,input.uploadedBy]
    )

    return result.rows[0]

}

export async function findTaskAccess(taskId:string):Promise<{id:string,created_by:string} | null>{
    const result = await getPool().query<{id:string,created_by:string}>(
        `
        SELECT id, created_by FROM tasks WHERE id = $1
        `,[taskId])

        return result.rows[0] ?? null
}

export async function listByTaskId(taskId:string):Promise<Attachments[]>{
    const result = await getPool().query<Attachments>(
        `
        SELECT id, task_id, image_url, public_id, uploaded_by, created_at
        FROM attachments
        WHERE task_id = $1
        ORDER BY created_at DESC
        `,
        [taskId]
    )

    return result.rows
}