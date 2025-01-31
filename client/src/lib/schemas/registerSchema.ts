import { z } from "zod";

const passwordValidation = new RegExp(
    /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,10})/
)
export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().regex(passwordValidation,{
        message: 'Password requires at least 1 lower case character, 1 upper case character, 1 number, 1 special character and must contain 6-10 characters'
    })
})

export type RegisterSchema = z.infer<typeof registerSchema>;