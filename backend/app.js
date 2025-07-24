import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express()
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
})) // middleware cofig ke use me aata hai use method

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true},{limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())
app.use(express.json()); // Enable JSON body parsing

  
//routes import

import userRouter from "./routes/user.router.js"

// routes declaration

app.use("/api/v1/user", userRouter)

import authRouter from "./routes/auth.router.js"

app.use("/api/v1/auth", authRouter)

// solutionPost routes



import contestRouter from "./routes/contest.router.js"

app.use("/api/v1/contest",contestRouter)

import lcStandingsRouter from "./routes/lcstandings.router.js"

app.use("/api/v1/lcstandings", lcStandingsRouter)

export { app }