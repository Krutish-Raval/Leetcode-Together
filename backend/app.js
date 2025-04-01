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
app.post('/check-profile', async (req, res) => {
    const { leetcodeId } = req.body;
    const url = `https://leetcode.com/${leetcodeId}`;
  
    try {
      const response = await axios.get(url);
      if (response.status === 200) {
        return res.json({ exists: true });
      }
    } catch (error) {
      if (error.response?.status === 404) {
        return res.json({ exists: false });
      }
      console.error("Error checking profile:", error.message);
      return res.status(500).json({ error: "Failed to check profile" });
    }
  });
  
//routes import

import userRouter from "./routes/user.router.js"

// routes declaration

app.use("/api/v1/user", userRouter)

// import authRouter from "./routes/auth.router.js"

// app.use("/api/v1/auth", authRouter)

// solutionPost routes
import solutionPostRouter from "./routes/solutionPost.router.js"

app.use("/api/v1/contest-solution", solutionPostRouter)

import uploadRouter from "./routes/codeUpload.router.js"

app.use("/api/v1/standing-solution",uploadRouter)

import contestRouter from "./routes/contest.router.js"

app.use("/api/v1/contest",contestRouter)

export { app }