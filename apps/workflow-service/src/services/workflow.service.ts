import { createConsumer, logger, runConsumer, TOPICS } from "shared";
import { DomainEvent } from "../utils/types";
import * as workflowRepo from '../repository/workflow.repository'



async function handleDomainEvent(rawData:DomainEvent){
    if(!rawData.eventType || !rawData.taskId || !rawData.userId){
        logger.warn({rawData},"invalid domain event")
        return
    }
    const workflow = await workflowRepo.createWorkflow({
        taskId:rawData.taskId,
        eventType:rawData.eventType,
        message:rawData.message || rawData.eventType,
        createdBy:rawData.userId
    })
    logger.info({workFlowId:workflow.id,eventType:workflow.event_type},'workflow-row created')
}
export async function startKafka(){
    const consumer = await createConsumer("workflow-service","workflow-service-group")
    await runConsumer(consumer,[TOPICS.TASK_EVENTS,TOPICS.MEDIA_EVENTS],async({message})=>{
        const value = message.value?.toString()
        if(!value) return 
        try {
            await handleDomainEvent(JSON.parse(value) as DomainEvent)
        } catch (error) {
            logger.error({error},"workflow consumer failed")
        }
    })
}