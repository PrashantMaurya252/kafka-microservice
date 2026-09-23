import { config } from "dotenv";
import express from 'express'
import {resolve} from 'node:path'
import {AppError, errorHandler, httpLogger, logger, requireGateWaySecret, successResponse} from 'shared'
import authRouter from "./routes/auth.routes";

config({path:resolve(process.cwd(),".env")})
config({path:resolve(process.cwd(),"../../.env")})

const PORT = process.env.AUTH_PORT || 3001

const app = express()
app.use(httpLogger)
app.use(express.json())

app.get("/health",(req,res)=>{
    successResponse(res,{service:"auth-service"})
})

app.use("/auth",requireGateWaySecret,authRouter)
app.use((req,res,next)=>{
    console.log("Requested path",req.path)
    next(new AppError(404,"Route not found in auth service"))
})

app.use(errorHandler)

app.listen(PORT,()=>{
    logger.info(`Auth service is now running on port ${PORT}`)
})