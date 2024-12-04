import express  from "express"
import { userRouter } from "./routes/users"
import { monitorRouter } from "./routes/monitors"
import cors from 'cors'

const PORT = 3000

var corsOptions = {
    origin: 'https://monitor-lizard.vercel.app',
    optionsSuccessStatus: 200
}

const app = express()

app.use(cors(corsOptions))

app.get("/",(req,res) => {
    res.json("working")
})

app.use('/api/v1/user', userRouter)
app.use('/api/v1/monitor', monitorRouter)

app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`)
})  