import { getPool } from "shared";
import { User, UserRole } from "../types/auth.types";



export async function createUser(input:{
    name:string;
    email:string;
    password:string;
    role?:UserRole;
}):Promise<User>{
    const result = await getPool().query<User>(
        `
        INSERT INTO users (name,email,password,role)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, password, role, created_at
        `,
        [input.name,input.email,input.password,input.role ?? "USER"]
    )
    return result.rows[0]
}

export async function findByEmail(email:string):Promise<User | null>{
    const result = await getPool().query<User>(
        `
        SELECT id, name, email, password, role, created_at
        FROM users
        WHERE email = $1
        `,
        [email]
    )

    return result.rows[0] ?? null
}

export async function findUserById(userId:string):Promise<User| null>{
    const result = await getPool().query<User>(
        `
        SELECT id, name, email, password, created_at
        FROM users
        WHERE id = $1
        `,
        [userId]
    )

    return result.rows[0] ?? null
}