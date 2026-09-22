import { AppError } from "shared";
import { createUser, findByEmail, findUserById } from "../repositories/user.repo";
import { LoginInput, RegisterInput } from "../schemas/auth.schema";
import bcrypt from 'bcryptjs'
import { convertToPublicUser, signToken } from "../utils/auth.utils";



export async function register(input:RegisterInput){
    const existing = await findByEmail(input.email)
    if(existing){
        throw new AppError(409,"Email already exist")
    }

    const passwordHash = await bcrypt.hash(input.password,10)
    const user = await createUser({name:input.name,email:input.email,password:passwordHash,role:'USER'})
    return convertToPublicUser(user)
}

export async function login(input:LoginInput){
    const user = await findByEmail(input.email)
    console.log("Login console",user,input)
    if(!user){
        throw new AppError(401,"Invalid Email and Password")
    }

    const valid = await bcrypt.compare(input.password,user.password)
    if(!valid){
        throw new AppError(401,"Invalid Email and password")
    }

    const token = signToken({userId:user.id,role:user.role})

    return {
        token,
        user:convertToPublicUser(user)
    }
}

export async function getMe(userId:string){
    const user = await findUserById(userId)
    if(!user){
        throw new AppError(404,'User not found')
    }
    return convertToPublicUser(user)
}