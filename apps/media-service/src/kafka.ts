import { createProducer, publishJsonSafe, TOPICS } from "shared";


let producer:Awaited<ReturnType<typeof createProducer>> | null = null

export async function initKafka(){
    producer = await createProducer("media-service")
}

export async function publishMediaEvent(taskId:string,userId:string){
    await publishJsonSafe(producer,TOPICS.MEDIA_EVENTS,{eventType:"media.uploaded",taskId,userId,message:"Media Uploaded",timestamp:new Date().toISOString()},taskId)
}