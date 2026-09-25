import { Router } from "express";
import * as mediaController from '../controllers/media.controller'
import type {Request,Response,NextFunction} from 'express'
import { uploadImage } from "../middleware/upload.middleware";
import { AppError } from "shared";

const router = Router()

function handleUpload(req:Request,res:Response,next:NextFunction){
    uploadImage(req,res,(err:unknown)=>{
        if(!err){
            return next()
        }

        if(err instanceof AppError){
            return next(err)
        }

        if(typeof err === "object"){}
    })
}

router.post("/:taskId/attachments",mediaController.uploadAttachments)

export default router