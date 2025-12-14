import express from 'express'
import authRoutes from './routes/authRoutes.js'
const app = express()
const PORT = process.env.PORT || 8888
//Middleware
app.use(express.json())


app.get('/',(req,res) => {
  res.sendStatus(200)
})


//Routes
app.use('/auth',authRoutes)


app.listen(PORT , ()=> console.log(`server has started on PORT: ${PORT} `))