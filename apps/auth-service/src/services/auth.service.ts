import { findByEmail } from "../repositories/user.repo";
import { RegisterInput } from "../schemas/auth.schema";



export async function register(input:RegisterInput){
    const existing = await findByEmail(input.email)
}