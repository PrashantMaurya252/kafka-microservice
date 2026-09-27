import type {Producer} from 'kafkajs'
import { createKafkaClient } from './client'
import { logger } from '../logger/logger'


export async function createProducer(clientId:string):Promise<Producer>{
    const kafka = createKafkaClient(clientId)


    // responsible for sending data to kafka topics
    const producer = kafka.producer()

    await producer.connect()

    logger.info({clientId},"kafka producer connected")

    return producer
}