import mongoose from 'mongoose';
import express from 'express'
import dotenv from 'dotenv';
import { DB_NAME } from './constants.js';
import { app } from './app.js'
import connectDB from './db/index.js';
dotenv.config({path: './.env'})
import axios from "axios"
const port = process.env.PORT || 7000

connectDB()
.then(() => {
    app.listen(process.env.PORT || 7000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})

// app.get("/api/friends-performance", async (req, res) => {
//     const { contestName, friendName } = req.query;

//     try {
//         // https://lccn.lbao.site/api/v1/contest-records/user?contest_name=weekly-contest-442&username=flicktoss&archived=false
//         const response = await axios.get(`https://lccn.lbao.site/api/v1/contest-records/user?contest_name=${contestName}&username=${friendName}&archived=false`);
//         // console.log(response.data)
//         res.json(response.data);
//     } catch (error) {
//         console.error("Error fetching contest data:", error);
//         res.status(500).json({ error: "Failed to fetch contest data" });
//     }
// });
 
// ;(async () => {
//    try{
//       await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
//       app.on("error",(e)=>{
//             console.log("ERROR: ",e);
//             throw e;
//       })
//       app.listen(port, () => {
//         console.log(`App listening on port ${port}`)
//       })
//    }
//    catch(e){
//        console.log("ERROR: " ,e);
//        throw e;
//    }
// })();



// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.get('/jokes',(req,res)=>{
//     const jokes = [
//         {
//             id: 1,
//             joke: 'Why did the scarecrow win an award? Because he was outstanding in his field.'
//         },
//         {
//             id: 2,
//             joke: 'Why did the tomato turn red? Because it saw the salad dressing!'
//         },
//         {
//             id: 3, 
//             joke: 'What do you call a fake noodle? An impasta!'
//         }
//     ]
//     res.send(jokes)
// }
// )
