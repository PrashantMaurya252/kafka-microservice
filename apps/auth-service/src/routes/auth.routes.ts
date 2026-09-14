import express from 'express'
import { validateBody } from 'shared'
import { loginSchema, registerSchema } from '../schemas/auth.schema'
import * as authController from '../controllers/auth.controller'


const authRouter = express.Router()

console.log("Auth router")

authRouter.post("/register",validateBody(registerSchema),authController.register)
authRouter.post("/login",validateBody(loginSchema),authController.login)
authRouter.post("/me",authController.getMe)


export default authRouter