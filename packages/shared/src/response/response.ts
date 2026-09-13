import type {Response} from 'express'


export function successResponse(res:Response,data:unknown,statusCode:number=200){
   return res.status(statusCode).json({
    success:true,
    data,
    
   })
}

export function errorResponse(res:Response,message:string,statusCode:number=200){
   return res.status(statusCode).json({
    success:true,
    message,
    
   })
}