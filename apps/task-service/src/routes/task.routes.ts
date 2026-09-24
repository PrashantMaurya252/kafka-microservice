import {Router} from 'express'
import { validateBody } from 'shared'
import { createTaskSchema } from '../schemas/task.schema'
import * as taskController from '../controllers/task.controller'

const router = Router()

router.post("/",validateBody(createTaskSchema),taskController.createTask)

export default router