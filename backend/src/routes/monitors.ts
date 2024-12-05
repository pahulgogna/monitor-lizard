import { CreateMonitorSchema, createMonitorSchema } from "@pahul100/monitor-lizard-common";
import { PrismaClient } from "@prisma/client";
import { verify } from "jsonwebtoken";
import express, { NextFunction, Request, Response, Router } from "express";
import axios from "axios";

export const monitorRouter = Router()

monitorRouter.use(express.json())
const prisma = new PrismaClient()

interface CustomRequest extends Request {
    parsedBody?: CreateMonitorSchema;
    userId?: string 
}

monitorRouter.use((req : CustomRequest, res: Response, next: NextFunction) => {
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
    catch{
        res.status(403)
        res.json({"detail": "Unauthorized"})
    }
    return
})

monitorRouter.post("/create",
    (req: CustomRequest, res: Response, next: NextFunction) => {
        var body = createMonitorSchema.safeParse(req.body)
        try{
            if(body.success){
                if(!body.data.url.startsWith("http://") && !body.data.url.startsWith("https://")){
                   body.data.url = "https://".concat(body.data.url)
                }
                req.parsedBody = body.data
                return next()
            }
            else{
                res.status(400)
                res.json({
                    "detail": body.error
                })
                return
            }
        }
        catch{
            res.status(400)
            res.json({
                "detail": "Invalid Inputs"
            })    
    }

}, 
    async (req: CustomRequest, res) => {
    try{
        const monitorData = req.parsedBody
        if(monitorData && req.userId){

            const existingMonitors = await prisma.monitor.findMany({
                where:{
                    userId: req.userId
                }
            })

            if(existingMonitors.length >= 6){
                res.status(400)
                res.json({"detail": "You have reached the maximum limit of 6 monitors. Please delete an existing monitor to create a new one."})
                return
            }

            let duplicate = false

            existingMonitors.forEach((v) => {
                if(v.url === monitorData.url){
                    duplicate = true
                }
            })

            if(duplicate){
                res.status(400)
                res.json({"detail": "duplicate monitors not allowed"})
                return
            }

            const startTime = (new Date()).getTime()
            const response = await axios.get(monitorData.url)
            const responseTime = (new Date()).getTime() - startTime

            let MonitorCreated = await prisma.monitor.create({
                data: {
                    url: monitorData.url,
                    name: monitorData.name,
                    userId: req.userId,
                    responseTime: responseTime,
                    status: response.status
                }
            })

            res.json(MonitorCreated)
            return
        }
        else{
            res.status(500)
            res.json({"detail": "Internal server error"})
        }

    }
    catch{
        res.status(500)
        res.json({"detail": "Internal server error"})
    }
})

monitorRouter.get("/all", async (req: CustomRequest, res) => {
    if(req.userId){
        try{
            const monitorsFound = await prisma.monitor.findMany({
                where: {
                    userId: req.userId
                }
            })
    
            res.json(monitorsFound)
            return
        }
        catch{
            res.status(500)
            res.json({"detail" : "Internal server error"})
        }
    }
    res.json()
})

monitorRouter.get("/:id", async (req, res) => {
    const { id } = req.params
    
    const monitorFound = await prisma.monitor.findFirst({
        where:{
            id: id
        }
    })

    if(monitorFound){
        res.json(monitorFound)
        return
    }
    else{
        res.status(404)
        res.json({"detail": "Not Found"})
    }
})

monitorRouter.put("/:id", async (req: CustomRequest, res) => {
    try{
        const { id } = req.params

        if(req.userId && req.parsedBody){

            await prisma.monitor.update({
                data:{
                    name: req.parsedBody.name,
                    url: req.parsedBody.url
                },
                where: {
                    userId: req.userId,
                    id: id
                }
            })
            res.json({detail: "updated"})
        }

    }
    catch{
        res.status(500)
        res.json({
            "detail": "Internal server error"
        })
    }
})

monitorRouter.delete("/:id", async (req: CustomRequest, res) => {
    try{
        const {id} = req.params
        if(req.userId){
            const deleted = await prisma.monitor.delete({
                where: {
                    id: id,
                    userId: req.userId
                }
            })

            res.json(deleted)
        }
    }
    catch(e){
        res.status(500)
        res.json({
            "detail": "Could not delete monitor!"
        })
    }
})