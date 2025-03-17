import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'
import { useEffect } from 'react'
function App() {
  const [jokes, setjokes] = useState([])
  useEffect(() => {
    axios.get('/jokes')
    .then((res) => {
      setjokes(res.data)
    }).catch((error) => {
      console.log(error)
    })
  })
  return (
    <>
      <h1>Krutish Raval</h1>
      <p>JOKES :{jokes.length}</p>
      {
        jokes.map((joke,index) => (
            <div key={joke.id}>
                <h3>{joke.joke}</h3>
            </div>
        ))
      }
    </>
  )
}

export default App
