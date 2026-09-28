import { Workflow } from "./types";


export function convertToPublicTask(workflow:Workflow){
    return {
        id:workflow.id,
        taskId:workflow.task_id,
        message:workflow.message,
        eventType:workflow.event_type,
        createdBy:workflow.created_by,
        createdAt:workflow.created_at
        
    }
}
