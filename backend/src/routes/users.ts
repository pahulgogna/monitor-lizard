import { UserSchema, userSchema } from "@pahul100/monitor-lizard-common";
import { PrismaClient } from "@prisma/client";
import { sign, verify } from "jsonwebtoken"
import CryptoJS from "crypto-js";
import express, { Router, Request, Response, NextFunction } from "express";

export const userRouter = Router()
const prisma = new PrismaClient()



userRouter.use(express.json())


interface CustomRequest extends Request {
    parsedBody?: UserSchema;
    userId?: string 
}


userRouter.use("/auth",(req: CustomRequest, res: Response, next: NextFunction) => {
    try{
        var body = userSchema.safeParse(req.body)
        if(body.success){
            req.parsedBody = body.data
            return next()
        }
        else{
            res.status(400)
            res.json({
                "detail": body.error
            })
        }
    }
    catch{
        res.status(400)
        res.json({
            "detail": "Invalid Input"
        })
    }
})

userRouter.post("/auth/signup" , async (req: CustomRequest, res: Response) => {
    const body = req.parsedBody
    try{

        if(body){

            var exists = await prisma.user.findFirst({
                where:{
                    email: body.email
                }
            })

            if (exists) {
                res.status(400).json({ "detail": "This email is already registered.", "user": true });
                return
            }
                
            const password = CryptoJS.SHA256(body.password).toString()
            
            const user = await prisma.user.create({
                            data:{
                                name: body.name,
                                email: body.email,
                                password: password
                            }
                        })

            let expire = Date.now() + 1000 * 60 * 60 * 24 * 7
            
            const token = sign({ id: user.id, exp: Math.floor(expire/1000), recover: false}, process.env.JWT_SECRET as string)
            res.status(201)
            res.json({
                "token": token
            })
            return
        }
        else{
            res.status(500)
            res.json({"detail": "Internal server error"})
            return
        }
    }
    catch(e){
        res.status(500)
        res.json({"detail": "Internal server error"})
        return
    }
})

userRouter.post('/auth/login', async (req : CustomRequest, res) => {
    var body = req.parsedBody
    try{

        if(body){

            var user = await prisma.user.findFirst({
                where:{
                    email: body.email
                }
            })

            if (user) {
                const password = CryptoJS.SHA256(body.password).toString()
                if(password === user.password){
                    let expire = Date.now() + 1000 * 60 * 60 * 24 * 7
            
                    const token = sign({ id: user.id, exp: Math.floor(expire/1000)}, process.env.JWT_SECRET as string)
                    
                    res.json({
                        "token": token
                    })
                    return
                }
                else{
                    res.status(401)
                    res.json({"detail": "Invalid Credentials"})
                }
            }
            else{
                res.status(404)
                res.json({"detail": "user not found"})
            }
        }
    }
    catch{
        res.status(500)
        res.json({"detail": "Internal server error"})
    }
})


userRouter.use((req : CustomRequest, res: Response, next: NextFunction) => {
    try{
        const header = req.header("authorization") || "";
        const token = header.split(' ')[1];

        //@ts-ignore
        const response: {id: string, exp: number, iat: number} = verify(token, process.env.JWT_SECRET as string)
        if(response.id){
            req.userId = response.id
            next()
        }
        else{
          res.status(403)
          res.json({"detail": "Unauthorized"})
        }
    }
    catch (e){
        res.status(403)
        res.json({"detail": "Unauthorized"})
    }
    return
})

userRouter.get('/ping', (req, res) => {
    res.json({"detail": "pong"})
})

userRouter.get("/", async (req : CustomRequest, res) => {
    if(req.userId){
        const user = await prisma.user.findFirst({
            where: {
                id: req.userId
            },
            select: {
                name: true,
                email: true,
            }
        })
        if(user){
            res.json(user)
        }
        else{
            res.status(404)
            res.json({"detail": "user not found"})
        }
    }
    else{
        res.status(400)
        res.json({"detail": "Bad Request"})
    }
})