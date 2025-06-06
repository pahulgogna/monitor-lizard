import z, { string } from 'zod'


export const userSchema = z.object({
    name : z.string(),
    email: z.string().email(),
    password: z.string().min(8)
})

export const createMonitorSchema = z.object({
    name: z.string(),
    url: z.string().url(),
})

export const monitorSchema = z.object({
    id: z.string(),
    name: z.string(),
    url: z.string().url(),
    userId: z.string(),
    
    responseTimeIN: z.number(),
    responseTimeUS: z.number(),
    responseTimeEU: z.number(),

    centralIndia: z.number(),
    eastUS: z.number(),
    westEurope: z.number()
})

export const mailSchema = z.object({
    to: z.string().email(),
    content: z.string(),
    subject: z.string()
})

export const verifyMailSchema = z.object({
    email: z.string().email()
})

export const resetMailSchema = z.object({
    email: z.string().email()
})

export const resetPasswordSchema = z.object({
    password: z.string().min(8)
})

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>
export type ResetMailSchema = z.infer<typeof resetMailSchema>
export type VerifyMailSchema = z.infer<typeof verifyMailSchema>
export type MailSchema = z.infer<typeof mailSchema>
export type UserSchema = z.infer<typeof userSchema>
export type CreateMonitorSchema = z.infer<typeof createMonitorSchema>
export type MonitorSchema = z.infer<typeof monitorSchema>