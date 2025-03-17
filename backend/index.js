import express from 'express'
import dotenv from 'dotenv';
dotenv.config();


const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/jokes',(req,res)=>{
    const jokes = [
        {
            id: 1,
            joke: 'Why did the scarecrow win an award? Because he was outstanding in his field.'
        },
        {
            id: 2,
            joke: 'Why did the tomato turn red? Because it saw the salad dressing!'
        },
        {
            id: 3, 
            joke: 'What do you call a fake noodle? An impasta!'
        }
    ]
    res.send(jokes)
}
)
app.get('/login',(req,res)=>{
    res.send('<h2>Login Page</h2>')
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})