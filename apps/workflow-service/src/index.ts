import { config } from "dotenv";
import express from 'express'
import {resolve} from 'node:path'
import {AppError, errorHandler, httpLogger, logger, requireGateWaySecret, successResponse} from 'shared'
import { startKafka } from "./services/workflow.service";
import workFlowRoutes from './routes/workflow.routes'




config({path:resolve(process.cwd(),".env")})
config({path:resolve(process.cwd(),"../../.env")})

const PORT = process.env.WORKFLOW_PORT || 3002

const app = express()
app.use(httpLogger)
app.use(express.json())

app.get("/health",(req,res)=>{
    successResponse(res,{service:"workflow-service"})
})

app.use(requireGateWaySecret,workFlowRoutes)
app.use((req,res,next)=>{
    
    next(new AppError(404,"Route not found in workflow service"))
})

app.use(errorHandler)

async function initStart(){
    try {
        await startKafka()
    } catch (error) {
        logger.error({error},"Kafka consumer init failed")
    }
    app.listen(PORT,()=>{
    logger.info(`Workflow service is now running on port ${PORT}`)
})
}

initStart()



