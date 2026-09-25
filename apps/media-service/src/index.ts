import { config } from "dotenv";
import express from 'express'
import {resolve} from 'node:path'
import {AppError, errorHandler, httpLogger, logger, requireGateWaySecret, successResponse} from 'shared'
import attachmentRoutes from './routes/media.routes'


config({path:resolve(process.cwd(),".env")})
config({path:resolve(process.cwd(),"../../.env")})

const PORT = process.env.MEDIA_PORT || 3003

const app = express()
app.use(httpLogger)
app.use(express.json())

app.get("/health",(req,res)=>{
    successResponse(res,{service:"media-service"})
})

app.use("/tasks",requireGateWaySecret,attachmentRoutes)

app.use((req,res,next)=>{
    console.log("Requested path",req.path)
    next(new AppError(404,"Route not found in media service"))
})

app.use(errorHandler)

app.listen(PORT,()=>{
    logger.info(`Media service is now running on port ${PORT}`)
})