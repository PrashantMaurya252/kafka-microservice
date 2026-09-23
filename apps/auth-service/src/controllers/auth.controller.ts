import { NextFunction, Request,Response } from "express";
import * as authService from '../services/auth.service'
import { AppError, successResponse } from "shared";
import { userInfo } from "node:os";

export async function register(req:Request,res:Response,next:NextFunction){
    try {
        const user = await authService.register(req.body)
        successResponse(res,{user},201)
    } catch (error) {
        next(error)
    }
}

export async function login(req:Request,res:Response,next:NextFunction){
    try {
        const result = await authService.login(req.body)
        successResponse(res,result)
    } catch (error) {
        next(error)
    }
}

export async function getMe(req:Request,res:Response,next:NextFunction){
    try {

        console.log("Auth Me Hit")
        const userId = req.header("x-user-id")
        if(!userId){
            throw new AppError(401,"Missing x-user-id header")
        }
        const user = await authService.getMe(userId)

        console.log("User",user)
        successResponse(res,{user})
    } catch (error) {
        next(error)
    }
}