import { getPool } from "shared";
import { TASK } from "../utils/types";


export async function createTask(input:{
    title:string;
    createdBy:string
}):Promise<TASK>{
    const result = await getPool().query<TASK>(
        `
        INSERT INTO tasks (title,created_by)
        VALUES($1,$2)
        RETURNING id, title, status, created_by, created_at, updated_at
        `,
        [input.title,input.createdBy]
    )

    return result.rows[0]
}


export async function listTasks(input:{userId:string,role?:string}):Promise<TASK[]>{

    if(input.role === "ADMIN"){
        const result = await getPool().query<TASK>(
        `
        SELECT id, title, status, created_by, created_at, updated_at
        FROM tasks
        ORDER BY created_at DESC
        `
    )

    return result.rows
    }

    const result = await getPool().query<TASK>(
        `
        SELECT id, title, status, created_by, created_at, updated_at
        FROM tasks
        WHERE created_by = $1
        ORDER BY created_at DESC
        `,
        [input.userId]
    )

    return result.rows
}

export async function findSingleTaskById(id:string):Promise<TASK | null>{
    const result = await getPool().query<TASK>(
        `
        SELECT id, title, status, created_by, created_at, updated_at
        FROM tasks
        WHERE id = $1
        `,
        [id]
    )
    return result.rows[0]

}

export async function deleteTaskById(id:string):Promise<boolean>{
    const result = await getPool().query(`DELETE FROM tasks WHERE id=$1`,[id])
    return (result.rowCount ?? 0) > 0
}