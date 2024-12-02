import z from 'zod'


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
    name: z.string(),
    url: z.string().url(),
    userId: z.string(),
    responseTime: z.number(),
    status: z.number()
})


export type UserSchema = z.infer<typeof userSchema>
export type CreateMonitorSchema = z.infer<typeof createMonitorSchema>
export type MonitorSchema = z.infer<typeof monitorSchema>