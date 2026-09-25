import { AppError } from "shared"
import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3"
import {randomUUID} from 'node:crypto'

function getClientInfo(){
    const endpoint = process.env.AWS_ENDPOINT_URL_S3
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
    const region = process.env.AWS_REGION

    if(!endpoint || !accessKeyId || !secretAccessKey){
        throw new Error("Storage envs are missing")
    }

    return new S3Client({
        region,
        endpoint,
        credentials:{accessKeyId,secretAccessKey},
        forcePathStyle:true
    })
}

export async function uploadBuffer(buffer:Buffer,contentType = "image/jpeg"):Promise<{imageUrl:string;publicId:string}>{
    const bucket = process.env.STORAGE_BUCKET
    const endPoint = process.env.AWS_ENDPOINT_URL_S3

    if(!bucket || !endPoint){
        throw new Error("endpoint and bucket are not present")
    }

    const key = `Support-tasks/${randomUUID()}`

    await getClientInfo().send(new PutObjectCommand({
        Bucket:bucket,
        Key:key,
        Body:buffer,
        ContentType:contentType
    }))

    const baseUrl = endPoint.endsWith("/") ? endPoint.slice(0,-1) : endPoint

    return {
        publicId:key,
        imageUrl:`${baseUrl}/${bucket}/${key}`
    }
}