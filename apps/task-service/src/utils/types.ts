


export type TASKSTATUS = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED"

export type TASK={
    id:string,
    title:string,
    status:TASKSTATUS,
    created_by:string,
    created_at:Date,
    updated_at:Date
}