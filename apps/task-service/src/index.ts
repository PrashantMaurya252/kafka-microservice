import { config } from "dotenv";
import express from 'express'
import {resolve} from 'node:path'
import {AppError, errorHandler, httpLogger, logger, requireGateWaySecret, successResponse} from 'shared'


config({path:resolve(process.cwd(),".env")})
config({path:resolve(process.cwd(),"../../.env")})

const PORT = process.env.TASK_PORT || 3002

const app = express()
app.use(httpLogger)
app.use(express.json())

app.get("/health",(req,res)=>{
    successResponse(res,{service:"task-service"})
})


app.use((req,res,next)=>{
    console.log("Requested path",req.path)
    next(new AppError(404,"Route not found in task service"))
})

app.use(errorHandler)

app.listen(PORT,()=>{
    logger.info(`Task service is now running on port ${PORT}`)
})