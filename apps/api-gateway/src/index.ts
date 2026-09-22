import {config} from 'dotenv'
import {resolve} from 'node:path'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { httpLogger } from 'shared'


config({path:resolve(process.cwd(),".env")})
config({path:resolve(process.cwd(),"../../.env")})


const PORT = process.env.PORT || 3000
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL

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