import { NextFunction,Request,Response } from "express";
import { AppError } from "./AppError";

export function errorHandler(err:unknown,req:Request,res:Response,next:NextFunction){
    if(err instanceof AppError){
        return res.status(err.statusCode).json({
            success:false,
            message:err.message
        })
    }

    console.log("Error in error handler",err)

    return res.status(500).json({
        success:false,
        message:"Internal Server error"
    })
}