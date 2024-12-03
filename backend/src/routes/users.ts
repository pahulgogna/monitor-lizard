import { UserSchema, userSchema, MailSchema, verifyMailSchema } from "@pahul100/monitor-lizard-common";
import { PrismaClient } from "@prisma/client";
import { sign, verify } from "jsonwebtoken"
import CryptoJS, { SHA256 } from "crypto-js";
import express, { Router, Request, Response, NextFunction, json } from "express";
import axios from "axios";


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


userRouter.post("/mail/verify", async (req, res) => {
    
    try{

        const email = verifyMailSchema.safeParse(req.body)

        if(email.data){

            const userExists = await prisma.user.findFirst({
                where:{
                    email: email.data.email
                }
            })

            if(userExists){

                res.status(409)
                res.json({
                    "detail": "this email is already registered"
                })
                return
            }

            const code = Math.ceil((Math.random() * 999999) + 100000)


            const mail: MailSchema = {
                to: email.data.email,
                content: 
                `Hi,

Thank you for signing up to Monitor Lizard! To complete your registration and verify your email address, please use the code below:

Your Verification Code: ${code}

If you didn't request this verification, you can safely ignore this email.

Best regards,
The Monitor Lizard Team
                `,
                subject: "Verification Email"
            }

            const data = await axios.post(process.env.mcl as string, JSON.stringify([process.env.code,[mail]]))
            
            res.json({
                detail: CryptoJS.SHA256(code.toString()).toString(),
            })
            return
        }
    }
    catch(e){
        console.log(e)
        res.status(500)
        res.json({
            detail: "Sorry, We could not verify your email."
        })
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