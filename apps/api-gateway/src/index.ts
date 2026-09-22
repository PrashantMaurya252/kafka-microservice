import {config} from 'dotenv'
import {resolve} from 'node:path'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { AppError, errorHandler, httpLogger, logger, successResponse } from 'shared'
import { createProxyMiddleware } from 'http-proxy-middleware'


config({path:resolve(process.cwd(),".env")})
config({path:resolve(process.cwd(),"../../.env")})


const PORT = process.env.PORT || 3000
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || "http://localhost:3001"

const app = express()
app.use(helmet())
app.use(cors())
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
}))

app.use(httpLogger)
app.use("/health",(req,res)=>{
    successResponse(res,{service:'api-gateway'})
})

// create proxy

app.use("/auth",createProxyMiddleware({
    target:AUTH_SERVICE_URL,
    changeOrigin:true,
    pathRewrite:(path)=>`/auth/${path}`
}));


app.use((req,res,next)=>{
    next(new AppError(404,"Route not found"))
})

app.use(errorHandler)

app.listen(PORT,()=>{
    logger.info(`API gateway running on port ${PORT}`)
})