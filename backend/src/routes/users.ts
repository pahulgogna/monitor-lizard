import { UserSchema, userSchema, MailSchema, verifyMailSchema, resetMailSchema, resetPasswordSchema } from "@pahul100/monitor-lizard-common";
import { PrismaClient } from "@prisma/client";
import { sign, verify } from "jsonwebtoken"
import CryptoJS, { SHA256 } from "crypto-js";
import express, { Router, Request, Response, NextFunction, json } from "express";
import axios from "axios";
import { outgoingMails } from "../messages";


export const userRouter = Router()
const prisma = new PrismaClient()

userRouter.use(express.json())

interface CustomRequest extends Request {
    parsedBody?: UserSchema;
    userId?: string;
    tokenData?: {
        id: string;
        exp: number;
        iat: number;
        reset: boolean;
    }
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
    catch(e){
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
                content: outgoingMails("verify", String(code)),
                subject: "Verification Email"
            }

            await axios.post(process.env.mcl as string, JSON.stringify([process.env.code,[mail]]))
            
            res.json({
                detail: CryptoJS.SHA256(code.toString()).toString(),
            })
            return
        }
    }
    catch(e){
        res.status(500)
        res.json({
            detail: "Sorry, We could not verify your email."
        })
    }
})

userRouter.post("/reset/link", async (req, res) => {
    let body = resetMailSchema.safeParse(req.body)

    if(!body.success){
        res.sendStatus(400)
        return
    }


    let email = body.data.email

    let user = await prisma.user.findFirst({
        where: {
            email: email
        }
    })

    if(user){


        let expire = Date.now() + 1000 * 60 * 60 * 2
            
        const token = sign({ id: user.id, exp: Math.floor(expire/1000), reset: true}, process.env.JWT_SECRET as string)
                    

        let mail: MailSchema = {
            to: user.email,
            subject: "Reset Password",
            content: outgoingMails("reset", token, user.name)
        }

        await axios.post(process.env.mcl as string, JSON.stringify([process.env.code,[mail]]))

        let emailArr = email.split('@')

        res.json({
            "message": "An email was sent to " + (emailArr[0].slice(0, Math.floor(emailArr[0].length/3) )) + "...@" + (emailArr[1]) + ", please follow the instructions in the mail for further instructions."
        })
    }
    else{
        res.sendStatus(404)
    }

})

userRouter.use((req : CustomRequest, res: Response, next: NextFunction) => {
    try{
        const header = req.header("authorization") || "";
        const token = header.split(' ')[1];

        //@ts-ignore
        const response: {id: string, exp: number, iat: number, reset: boolean} = verify(token, process.env.JWT_SECRET as string)
        if(response.id){
            req.userId = response.id
            req.tokenData = response
            return next()
        }
        else{
          res.status(403)
          res.json({"detail": "Unauthorized"})
        }
    }
    catch (e){
        console.log(e)
        res.status(403)
        res.json({"detail": "Unauthorized"})
    }
    return
})

userRouter.post("/reset", async (req: CustomRequest, res) => {
    
    if(req.tokenData?.reset){
        let password = resetPasswordSchema.safeParse(req.body)
        
        if(password.success){
            let user = await prisma.user.update({
                where: {
                    id: req.userId
                },
                data: {
                    password: CryptoJS.SHA256(password.data.password).toString()
                }
            })

            if(user){
                res.json({
                    "detail": "Password changed."
                })
                return
            }
            else{
                res.sendStatus(404)
                return
            }
        }
        else{
            res.sendStatus(400)
            return
        }
    }
    else{
        res.sendStatus(400)
        return
    }
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
